import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainPage } from "@/pages/MainPage";
import { HubPage } from "@/pages/HubPage";
import { EditorPage } from "@/pages/EditorPage";
import { StatisticsPage } from "@/pages/StatisticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
