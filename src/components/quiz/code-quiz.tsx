"use client";

import { useState } from "react";
import { Terminal, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeQuizProps {
  question: string;
  templateCode: string;
  onCodeChange: (code: string) => void;
  isAnswered: boolean;
  onRun: () => Promise<void>;
  isLoading: boolean;
  output: string | null;
  error: string | null;
}

export const CodeQuiz = ({
  question,
  templateCode,
  onCodeChange,
  isAnswered,
  onRun,
  isLoading,
  output,
  error,
}: CodeQuizProps) => {
  const [code, setCode] = useState(templateCode);

  const handleChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange(newCode);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 leading-tight">
        {question}
      </h2>

      <div className="space-y-4">
        <div className="rounded-3xl border-2 border-slate-200 overflow-hidden bg-slate-900 shadow-lg">
          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
              <Terminal size={14} />
              main.py
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={onRun}
              isLoading={isLoading}
              disabled={isAnswered}
              className="h-8 rounded-lg text-xs"
              leftIcon={<Play size={12} fill="currentColor" />}
            >
              実行
            </Button>
          </div>
          <textarea
            value={code}
            onChange={(e) => !isAnswered && handleChange(e.target.value)}
            disabled={isAnswered}
            className={`
              w-full h-40 p-4 font-mono text-sm bg-transparent text-slate-100 focus:outline-none resize-none
              ${isAnswered ? "opacity-70" : ""}
            `}
            spellCheck={false}
          />
        </div>

        {(output !== null || error !== null) && (
          <div className={`
            p-4 rounded-2xl border-2 font-mono text-xs
            ${error ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-100 border-slate-200 text-slate-700"}
          `}>
            <p className="font-black mb-1 opacity-50 uppercase">{error ? "Error" : "Output"}</p>
            <pre className="whitespace-pre-wrap">{error || output || "(出力なし)"}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
