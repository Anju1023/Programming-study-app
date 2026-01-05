"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileFrame } from "@/components/layout/mobile-frame";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // ここでエラーログサービスに送信したりする
    console.error(error);
  }, [error]);

  return (
    <MobileFrame className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-sm w-full bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500">
          <AlertTriangle size={40} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800">
            何かうまくいかなかったみたい...
          </h2>
          <p className="text-slate-500 font-bold">
            ごめんね、エラーが発生しました。<br />
            もう一度試してみて！
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={reset}
            variant="primary"
            className="w-full"
            leftIcon={<RefreshCw size={20} />}
          >
            再読み込みする
          </Button>
        </div>
        
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-slate-900 rounded-xl text-left overflow-hidden">
            <p className="text-xs font-mono text-red-400 mb-2 font-bold">Error Details:</p>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-all">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
