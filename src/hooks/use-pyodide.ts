// src/hooks/use-pyodide.ts
"use client";

import { useEffect, useRef, useState } from "react";
import * as Comlink from "comlink";
import type { PythonApi } from "@/workers/python.worker";

export const usePyodide = () => {
  const [isReady, setIsReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const apiRef = useRef<Comlink.Remote<PythonApi> | null>(null);

  useEffect(() => {
    // Workerの初期化
    const worker = new Worker(
      new URL("../workers/python.worker.ts", import.meta.url),
      { type: "module" },
    );
    
    const api = Comlink.wrap<PythonApi>(worker);
    
    workerRef.current = worker;
    apiRef.current = api;
    
    setIsReady(true);

    return () => {
      worker.terminate();
    };
  }, []);

  const runPython = async (code: string) => {
    if (!apiRef.current) {
      return { result: null, error: "Python environment is not ready." };
    }
    return await apiRef.current.run(code);
  };

  return { isReady, runPython };
};
