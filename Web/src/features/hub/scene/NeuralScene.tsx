import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  axonCurve,
  buildDendrites,
  buildGraph3D,
  type NeuralEdge3D,
  type NeuronNode3D,
} from "./neuralData";

/** Textura de brilho radial (branco → transparente), criada uma vez e tingida por sprite. */
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

/* ── Soma (corpo celular) — membrana orgânica que respira ────────────────── */
function Soma({ node, glow }: { node: NeuronNode3D; glow: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const spriteRef = useRef<THREE.Sprite>(null);

  const isDead = node.status === "dead";
  const isFiring = node.status === "firing";
  const base = isDead ? DEAD_COLOR : node.color;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = isFiring ? 3.4 : 1.1;
    const amp = isFiring ? 0.26 : 0.07;
    const pulse = 1 + Math.sin(t * speed + node.seed) * amp * (isDead ? 0 : 1);
    meshRef.current?.scale.setScalar(pulse);
    if (spriteRef.current) {
      spriteRef.current.scale.setScalar(node.radius * (isFiring ? 7.5 : 5) * pulse);
      (spriteRef.current.material as THREE.SpriteMaterial).opacity = isDead
        ? 0.06
        : isFiring
          ? 0.55
          : 0.3;
    }
  });

  return (
    <group position={node.position}>
      <sprite ref={spriteRef}>
        <spriteMaterial
          map={glow}
          color={base}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[node.radius, 3]} />
        {isDead ? (
          <meshStandardMaterial color={base} emissive={base} emissiveIntensity={0.05} roughness={0.85} />
        ) : (
          <MeshDistortMaterial
            color={base}
            emissive={base}
            emissiveIntensity={isFiring ? 1.0 : 0.5}
            distort={isFiring ? 0.34 : 0.22}
            speed={isFiring ? 4.5 : 1.6}
            roughness={0.3}
            metalness={0.15}
          />
        )}
      </mesh>
    </group>
  );
}

/* ── Dendritos — filamentos ramificados num único LineSegments ───────────── */
function Dendrites({ nodes }: { nodes: NeuronNode3D[] }) {
  const geometry = useMemo(() => {
    const { positions, colors } = buildDendrites(nodes);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [nodes]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ── Potencial de ação viajando por um axônio ────────────────────────────── */
function ActionPotential({ curve, color }: { curve: THREE.CatmullRomCurve3; color: THREE.Color }) {
  const ref = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.32 + offset) % 1;
    ref.current.position.copy(curve.getPointAt(t));
    const fade = Math.sin(t * Math.PI);
    ref.current.scale.setScalar(0.4 + fade * 0.9);
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── Axônios — tubos curvos + terminais sinápticos ───────────────────────── */
function Axons({ nodes, edges }: { nodes: NeuronNode3D[]; edges: NeuralEdge3D[] }) {
  const data = useMemo(
    () =>
      edges.map((e) => {
        const curve = axonCurve(nodes[e.a].position, nodes[e.b].position);
        const geometry = new THREE.TubeGeometry(curve, 26, e.active ? 0.02 : 0.012, 6, false);
        const terminal = curve.getPointAt(0.9);
        return { id: e.id, curve, geometry, terminal, color: nodes[e.a].color, active: e.active };
      }),
    [nodes, edges],
  );

  return (
    <>
      {data.map((d) => (
        <group key={d.id}>
          <mesh geometry={d.geometry}>
            <meshStandardMaterial
              color="#333744"
              emissive={d.color}
              emissiveIntensity={d.active ? 0.45 : 0.12}
              transparent
              opacity={d.active ? 0.6 : 0.42}
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
          {/* bulbo sináptico no terminal */}
          <mesh position={d.terminal}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={d.color} emissive={d.color} emissiveIntensity={0.6} roughness={0.4} />
          </mesh>
          {d.active && <ActionPotential curve={d.curve} color={d.color} />}
        </group>
      ))}
    </>
  );
}

/** A rede inteira deriva lentamente no espaço (flutuação livre, sem orbitar um ponto fixo). */
function DriftGroup({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    // deriva bem sutil — dá vida sem atrapalhar a navegação por voo livre
    ref.current.rotation.y += delta * 0.015;
  });
  return <group ref={ref}>{children}</group>;
}

function World({ count }: { count: number }) {
  const glow = useMemo(makeGlowTexture, []);
  const graph = useMemo(() => buildGraph3D(count), [count]);

  return (
    <>
      <hemisphereLight args={["#cdd3e6", "#14151a", 0.55]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[9, 11, 13]} intensity={55} color="#e2e7f4" distance={64} decay={1.6} />
      <pointLight position={[-13, -7, -10]} intensity={22} color="#8d93a8" distance={52} decay={1.8} />
      <fog attach="fog" args={["#14151a", 20, 48]} />

      {/* neurotransmissores/poeira flutuando — profundidade e vida (campo fixo do espaço) */}
      <Sparkles count={180} scale={[30, 22, 30]} size={2.2} speed={0.22} color="#aeb4c8" opacity={0.5} />

      <DriftGroup>
        <Dendrites nodes={graph.nodes} />
        <Axons nodes={graph.nodes} edges={graph.edges} />
        {graph.nodes.map((n) => (
          <Soma key={n.id} node={n} glow={glow} />
        ))}
      </DriftGroup>

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.22} luminanceSmoothing={0.35} mipmapBlur radius={0.7} />
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
      // aplicação direta do delta do mouse — sem easing/inércia
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
    const d = Math.min(delta, 0.05) * speed * boost; // clamp evita "salto" após travar
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
    <Canvas
      camera={{ position: [0, 2, 22], fov: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <World count={count} />
      <FreeFlyControls speed={9} sensitivity={0.0024} />
    </Canvas>
  );
}
