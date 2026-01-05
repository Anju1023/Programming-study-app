"use client";

import { useState, useEffect } from "react";
import { Reorder, motion } from "framer-motion";
import { GripVertical } from "lucide-react";

interface ParsonsQuizProps {
  question: string;
  initialBlocks: string[];
  correctOrder: string[];
  onOrderChange: (currentOrder: string[]) => void;
  isAnswered: boolean;
}

export const ParsonsQuiz = ({
  question,
  initialBlocks,
  correctOrder,
  onOrderChange,
  isAnswered,
}: ParsonsQuizProps) => {
  const [items, setItems] = useState(initialBlocks);

  useEffect(() => {
    onOrderChange(items);
  }, [items, onOrderChange]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-slate-800 leading-tight">
        {question}
      </h2>

      <p className="text-slate-500 font-bold text-sm">
        ブロックを正しい順番に並べ替えてね！
      </p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={!isAnswered ? setItems : () => {}}
        className="space-y-3"
      >
        {items.map((block) => (
          <Reorder.Item
            key={block}
            value={block}
            drag={!isAnswered ? "y" : false}
            className={`
              flex items-center gap-4 p-4 rounded-2xl border-2 bg-white font-mono font-bold text-slate-700 shadow-sm
              ${isAnswered ? "opacity-80" : "cursor-grab active:cursor-grabbing"}
              border-slate-200
            `}
          >
            {!isAnswered && <GripVertical className="text-slate-400" size={20} />}
            <span className="flex-1">{block}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {isAnswered && (
        <div className="mt-4 p-4 rounded-xl bg-slate-100 border-2 border-slate-200">
          <p className="text-xs font-black text-slate-500 uppercase mb-2">あなたの回答:</p>
          <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap">
            {items.join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
};
