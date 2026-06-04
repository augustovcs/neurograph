import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainPage } from "@/pages/MainPage";
import { EditorPage } from "@/pages/EditorPage";
import { StatisticsPage } from "@/pages/StatisticsPage";

// Hub carrega Three.js (pesado) — só baixa quando o usuário entra na rota.
const HubPage = lazy(() =>
  import("@/pages/HubPage").then((m) => ({ default: m.HubPage })),
);

function HubFallback() {
  return (
    <div className="grid h-screen place-items-center text-sm text-muted">
      Carregando mundo neural…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/hub"
          element={
            <Suspense fallback={<HubFallback />}>
              <HubPage />
            </Suspense>
          }
        />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
