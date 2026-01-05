"use client";

import { motion } from "framer-motion";
import { Trophy, Star, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  xpGained: number;
  onContinue: () => void;
}

export const ResultScreen = ({
  score,
  totalQuestions,
  xpGained,
  onContinue,
}: ResultScreenProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 px-6 py-12 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="relative"
      >
        <div className="w-48 h-48 bg-duo-yellow rounded-full flex items-center justify-center shadow-lg border-b-8 border-yellow-600">
          <Trophy size={80} className="text-white" />
        </div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 w-16 h-16 bg-duo-blue rounded-full flex items-center justify-center border-b-4 border-blue-600 text-white"
        >
          <Star size={32} fill="currentColor" />
        </motion.div>
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-800">レッスン完了！</h1>
        <p className="text-slate-500 font-bold text-lg">
          よく頑張ったね！今回の成績はこちら：
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase mb-1">正解率</p>
          <p className="text-2xl font-black text-duo-green">{percentage}%</p>
        </div>
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase mb-1">獲得 XP</p>
          <p className="text-2xl font-black text-duo-yellow">+{xpGained}</p>
        </div>
      </div>

      <div className="w-full max-w-sm pt-8">
        <Button
          onClick={onContinue}
          variant="primary"
          className="w-full py-8 text-xl"
          rightIcon={<ArrowRight size={24} />}
        >
          続ける
        </Button>
        <Link href="/learn" className="block mt-4">
          <Button variant="ghost" className="w-full text-slate-400">
            <Home size={20} className="mr-2" />
            ホームに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
};
