// src/workers/python.worker.ts
import { expose } from "comlink";

// WebWorkerのグローバルスコープを定義
declare const self: Worker & {
  loadPyodide: (config: any) => Promise<any>;
  importScripts: (...urls: string[]) => void;
};

let pyodide: any = null;

const loadPyodide = async () => {
  if (pyodide) return;

  try {
    // CDNからPyodideを読み込む
    self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js");

    // Pyodideの初期化
    pyodide = await self.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/",
    });
    
    console.log("Python Worker: Pyodide loaded!");
  } catch (err) {
    console.error("Failed to load Pyodide:", err);
    throw err;
  }
};

const pythonApi = {
  async run(code: string) {
    if (!pyodide) await loadPyodide();

    try {
      let stdout = "";
      pyodide.setStdout({
        batched: (text: string) => {
          stdout += text + "\n";
        },
      });

      await pyodide.runPythonAsync(code);
      
      return { result: stdout.trim(), error: null };
    } catch (err: any) {
      return { result: null, error: err.message };
    }
  },
};

expose(pythonApi);
export type PythonApi = typeof pythonApi;