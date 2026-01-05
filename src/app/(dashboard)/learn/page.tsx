"use client";

import { MobileFrame } from "@/components/layout/mobile-frame";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Star, Play, Lock, CheckCircle2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

// モックデータ: ユニットとレッスンの構造
const units = [
  {
    id: "unit-1",
    title: "Pythonの基本",
    description: "変数とデータ型を学ぼう",
    lessons: [
      { id: "l1", title: "Hello World", status: "completed", type: "quiz" },
      { id: "l2", title: "変数を使ってみる", status: "active", type: "quiz" },
      { id: "l3", title: "数値と計算", status: "locked", type: "quiz" },
      { id: "l4", title: "文字列の操作", status: "locked", type: "quiz" },
      { id: "l5", title: "ユニットテスト", status: "locked", type: "boss" },
    ],
  },
];

export default function LearnPage() {
  return (
    <MobileFrame className="bg-slate-50 min-h-screen">
      <div className="sticky top-0 z-30 bg-white border-b-2 border-slate-200 px-4 py-4 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">学習マップ</h1>
          <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full text-amber-700 font-bold text-sm">
            <Star size={16} fill="currentColor" />
            120 XP
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ProgressBar value={40} className="h-3" />
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">2 / 5</span>
        </div>
      </div>

      <div className="p-4 space-y-8 pb-32">
        {units.map((unit) => (
          <section key={unit.id} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-duo-green text-white p-6 rounded-3xl shadow-lg border-b-8 border-green-700"
            >
              <h2 className="text-2xl font-black">{unit.title}</h2>
              <p className="text-green-50 opacity-90 font-bold">{unit.description}</p>
            </motion.div>

            <div className="flex flex-col items-center gap-4 relative">
              {/* レッスンを蛇行させて並べる（Duolingoっぽく） */}
              {unit.lessons.map((lesson, index) => {
                const marginLeft = [0, 40, 60, 20, -20][index % 5];
                
                return (
                  <motion.div 
                    key={lesson.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative transition-transform active:scale-95"
                    style={{ marginLeft: `${marginLeft}px` }}
                  >
                    {lesson.status !== "locked" ? (
                      <Link href={`/lesson/${lesson.id}`}>
                        <div
                          className={`
                            w-20 h-20 rounded-full border-b-8 flex items-center justify-center transition-all cursor-pointer
                            ${lesson.status === "completed" 
                              ? "bg-duo-green border-green-700 text-white" 
                              : lesson.status === "active"
                              ? "bg-duo-blue border-blue-600 text-white animate-bounce-slow"
                              : "bg-slate-200 border-slate-300 text-slate-400"}
                          `}
                        >
                          {lesson.status === "completed" ? (
                            <CheckCircle2 size={32} />
                          ) : lesson.type === "boss" ? (
                            <Trophy size={32} className={lesson.status === "locked" ? "" : "text-amber-300"} />
                          ) : (
                            <Play size={32} fill="currentColor" />
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div
                        className={`
                          w-20 h-20 rounded-full border-b-8 flex items-center justify-center transition-all
                          bg-slate-200 border-slate-300 text-slate-400
                        `}
                      >
                        {lesson.type === "boss" ? (
                          <Trophy size={32} />
                        ) : (
                          <Lock size={32} />
                        )}
                      </div>
                    )}
                    
                    {/* レッスン名（吹き出しっぽく） */}
                    {lesson.status === "active" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-md border-2 border-slate-200 text-xs font-black text-slate-700 whitespace-nowrap"
                      >
                        スタート！
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <BottomNav />
    </MobileFrame>
  );
}
