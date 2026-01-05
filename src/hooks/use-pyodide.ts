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
    
    // Pyodideの初期化 (アイドル時に実行)
    const initPyodide = async () => {
      try {
        await api.init();
        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize Pyodide:", err);
      }
    };

    if ("requestIdleCallback" in window) {
      // ブラウザがアイドル状態になったら読み込み開始
      (window as any).requestIdleCallback(() => {
        initPyodide();
      });
    } else {
      // フォールバック: 2秒後に読み込み
      setTimeout(() => {
        initPyodide();
      }, 2000);
    }

    return () => {
      worker.terminate();
    };
  }, []);

  const runPython = async (code: string) => {
    if (!apiRef.current) {
      return { result: null, error: "Python environment is not ready." };
    }
    // initが終わっていなくてもworker側でloadPyodideが呼ばれるので動作するが、
    // isReadyの状態と同期させるために確認しておくとより安全
    return await apiRef.current.run(code);
  };

  return { isReady, runPython };
};
