"use client";

import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/learn"); // ログイン後は学習マップへ
      router.refresh();
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setError("確認メールを送信しました！メールをチェックしてね。");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border-b-8 border-slate-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-duo-green">おかえり！</h1>
          <p className="mt-2 text-slate-600">
            今日も楽しくPythonを学ぼう！🐍
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-10 text-slate-900 placeholder-slate-400 focus:border-duo-green focus:outline-none focus:ring-4 focus:ring-duo-green/20"
                placeholder="メールアドレス"
              />
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3 pl-10 text-slate-900 placeholder-slate-400 focus:border-duo-green focus:outline-none focus:ring-4 focus:ring-duo-green/20"
                placeholder="パスワード"
              />
            </div>
          </div>

          {error && (
            <div className={`rounded-xl p-4 text-sm ${error.includes("送信しました") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-2xl border-b-4 border-green-600 bg-duo-green py-3 px-4 text-sm font-bold text-white transition-all hover:bg-green-500 active:translate-y-1 active:border-b-0 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center">
                  ログイン
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full rounded-2xl border-2 border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              アカウントを作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
