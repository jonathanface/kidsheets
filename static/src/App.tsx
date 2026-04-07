import { useCallback, useState } from "react";
import { WorksheetConfig } from "./types/Worksheet";
import { ConfigPanel } from "./components/ConfigPanel";
import { WorksheetPreview } from "./components/WorksheetPreview";
import "./css/app.css";

const DEFAULT_CONFIG: WorksheetConfig = {
  grade: "1",
  title: "",
  sections: [],
};

export const App = () => {
  const [config, setConfig] = useState<WorksheetConfig>(DEFAULT_CONFIG);
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const handleRegenerate = useCallback(() => {
    setRegenerateKey((k) => k + 1);
  }, []);

  const handleReset = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG });
    setRegenerateKey((k) => k + 1);
    setResetKey((k) => k + 1);
  }, []);

  const handleRemoveSection = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  }, []);

  const [printWithAnswers, setPrintWithAnswers] = useState(false);

  const handlePrint = useCallback((withAnswers: boolean) => {
    setPrintWithAnswers(withAnswers);
    // Double rAF ensures React has committed the re-render before printing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }, []);

  return (
    <div className={`app ${printWithAnswers ? "print-with-answers" : "print-without-answers"}`}>
      <header className="app-header no-print">
        <div className="app-header-inner">
          <img src="/logo.png" alt="KidSheets logo" className="app-logo" onClick={handleReset} />
          <div>
            <h1>KidSheets</h1>
            <p>Create. Print. Learn!</p>
          </div>
        </div>
      </header>
      <main className="app-main">
        <aside className="no-print">
          <ConfigPanel
            key={resetKey}
            config={config}
            onChange={setConfig}
            onRegenerate={handleRegenerate}
            onPrint={handlePrint}
          />
        </aside>
        <section className="preview-area">
          <WorksheetPreview config={config} regenerateKey={regenerateKey} onRemoveSection={handleRemoveSection} />
        </section>
      </main>
    </div>
  );
};
