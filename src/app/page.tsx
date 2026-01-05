"use client";

import { useState } from "react";
import { usePyodide } from "@/hooks/use-pyodide";
import { Play, Code, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { isReady, runPython } = usePyodide();
  const [code, setCode] = useState(
    'print("Hello from Python in the browser!")\n\n# Try some math!\na = 10\nb = 20\nprint(f"{a} + {b} = {a + b}")',
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { result, error } = await runPython(code);
      if (error) {
        setError(error);
        setOutput("");
      } else {
        setOutput(result || "");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8 font-sans">
      <div className="w-full max-w-2xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="flex items-center justify-center gap-2 text-4xl font-bold text-duo-green">
            <Code size={40} />
            Python Study App
          </h1>
          <p className="text-slate-600">ブラウザでPythonを動かしてみよう！</p>
        </header>

        <Card className="border-b-8 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-700">
              <Terminal size={24} />
              エディタ
            </h2>
            <Button
              onClick={handleRun}
              disabled={!isReady}
              isLoading={isLoading}
              variant="primary"
              leftIcon={<Play size={20} fill="currentColor" />}
            >
              実行する
            </Button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-48 w-full rounded-2xl bg-slate-900 p-4 font-mono text-slate-100 focus:outline-none focus:ring-4 focus:ring-duo-green/20"
            spellCheck={false}
          />
        </Card>

        {(output || error) && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 border-b-8 p-6 shadow-xl duration-500">
            <h2 className="mb-4 text-xl font-bold text-slate-700">実行結果</h2>
            {error ? (
              <pre className="overflow-x-auto rounded-xl border border-red-200 bg-red-50 p-4 text-duo-red">
                {error}
              </pre>
            ) : (
              <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-4 font-mono text-slate-800">
                {output || "（出力なし）"}
              </pre>
            )}
          </Card>
        )}

        {!isReady && (
          <p className="animate-pulse text-center text-slate-400">
            Python環境を準備中...
          </p>
        )}
      </div>
    </main>
  );
}