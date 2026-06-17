import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { buildNeuronNodes } from "./neuralData";

/** Textura de brilho radial (branco → transparente), criada uma vez. */
function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const DEAD_COLOR = new THREE.Color("#4b4f59");

/**
 * Todos os neurônios em apenas DOIS objetos (rápido, escala p/ milhares):
 *   • InstancedMesh — o corpo (soma) de cada neurônio, cor por grupo
 *   • Points        — o halo de brilho colorido (additivo), realçado pelo Bloom
 * Sem componente/animação por neurônio: o "respiro" é um pulso global barato.
 */
function Neurons({ count }: { count: number }) {
  const nodes = useMemo(() => buildNeuronNodes(count), [count]);
  const glow = useMemo(makeGlowTexture, []);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowMat = useRef<THREE.PointsMaterial>(null);

  // cor de exibição (mortos ficam acinzentados)
  const colorOf = (n: (typeof nodes)[number]) => (n.status === "dead" ? DEAD_COLOR : n.color);

  // matrizes + cores das instâncias do soma
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    nodes.forEach((n, i) => {
      dummy.position.copy(n.position);
      dummy.scale.setScalar(n.radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, colorOf(n));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes]);

  // geometria dos halos (posição + cor por ponto)
  const glowGeometry = useMemo(() => {
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      const c = colorOf(n);
      positions[i * 3] = n.position.x;
      positions[i * 3 + 1] = n.position.y;
      positions[i * 3 + 2] = n.position.z;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [nodes]);

  // pulso global sutil no tamanho dos halos — dá vida sem custo por neurônio
  useFrame((state) => {
    if (glowMat.current) glowMat.current.size = 1.25 + Math.sin(state.clock.elapsedTime * 1.3) * 0.18;
  });

  return (
    <group>
      <points geometry={glowGeometry}>
        <pointsMaterial
          ref={glowMat}
          map={glow}
          size={1.25}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <instancedMesh key={nodes.length} ref={meshRef} args={[undefined, undefined, nodes.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.3} metalness={0.15} />
      </instancedMesh>
    </group>
  );
}

/** A rede inteira deriva lentamente no espaço (sem atrapalhar a navegação). */
function DriftGroup({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });
  return <group ref={ref}>{children}</group>;
}

function World({ count }: { count: number }) {
  return (
    <>
      <hemisphereLight args={["#cdd3e6", "#14151a", 0.55]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[9, 11, 13]} intensity={55} color="#e2e7f4" distance={90} decay={1.5} />
      <pointLight position={[-13, -7, -10]} intensity={22} color="#8d93a8" distance={80} decay={1.7} />
      <fog attach="fog" args={["#14151a", 24, 70]} />

      <Sparkles count={140} scale={[42, 28, 42]} size={2.2} speed={0.2} color="#aeb4c8" opacity={0.45} />

      <DriftGroup>
        <Neurons count={count} />
      </DriftGroup>

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.2} luminanceSmoothing={0.35} mipmapBlur radius={0.7} />
        <Vignette offset={0.22} darkness={0.72} />
      </EffectComposer>
    </>
  );
}

/**
 * Voo livre com mira DIRETA (sem suavização). WASD move pelo espaço, R/F sobe e
 * desce, Shift acelera. Segurar o botão esquerdo e mover o mouse gira a câmera
 * 1:1 com o deslocamento do cursor — resposta seca, sem inércia.
 */
function FreeFlyControls({ speed = 9, sensitivity = 0.0024 }: { speed?: number; sensitivity?: number }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const keys = useRef<Set<string>>(new Set());
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    const el = gl.domElement;
    euler.current.setFromQuaternion(camera.quaternion);

    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      euler.current.y -= dx * sensitivity;
      euler.current.x -= dy * sensitivity;
      const lim = Math.PI / 2 - 0.01;
      euler.current.x = Math.max(-lim, Math.min(lim, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };
    const onUp = (e: PointerEvent) => {
      dragging.current = false;
      el.style.cursor = "";
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ponteiro já liberado */
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, sensitivity]);

  useFrame((_, delta) => {
    const k = keys.current;
    const boost = k.has("ShiftLeft") || k.has("ShiftRight") ? 2.6 : 1;
    const d = Math.min(delta, 0.05) * speed * boost;
    if (k.has("KeyW")) camera.translateZ(-d);
    if (k.has("KeyS")) camera.translateZ(d);
    if (k.has("KeyA")) camera.translateX(-d);
    if (k.has("KeyD")) camera.translateX(d);
    if (k.has("KeyR") || k.has("Space")) camera.translateY(d);
    if (k.has("KeyF")) camera.translateY(-d);
  });

  return null;
}

export function NeuralScene({ count = 26 }: { count?: number }) {
  return (
    <Canvas camera={{ position: [0, 2, 22], fov: 50 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <World count={count} />
      <FreeFlyControls speed={9} sensitivity={0.0024} />
    </Canvas>
  );
}
