"use client";

import { motion } from "framer-motion";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isAnswered: boolean;
  correctAnswer: string;
}

export const MultipleChoice = ({
  question,
  options,
  selectedOption,
  onSelect,
  isAnswered,
  correctAnswer,
}: MultipleChoiceProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-slate-800 leading-tight">
        {question}
      </h2>

      <div className="grid gap-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === correctAnswer;
          const isWrong = isSelected && !isCorrect;

          return (
            <button
              key={option}
              onClick={() => !isAnswered && onSelect(option)}
              disabled={isAnswered}
              className={`
                w-full p-4 rounded-2xl border-2 text-left font-bold transition-all
                ${
                  isSelected
                    ? "border-duo-blue bg-blue-50 text-duo-blue"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }
                ${
                  isAnswered && isCorrect
                    ? "border-duo-green bg-green-50 text-duo-green"
                    : ""
                }
                ${
                  isAnswered && isWrong
                    ? "border-duo-red bg-red-50 text-duo-red"
                    : ""
                }
              `}
            >
              <span className="flex items-center gap-4">
                <span className={`
                  w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm
                  ${isSelected ? "border-duo-blue" : "border-slate-200"}
                `}>
                  {index + 1}
                </span>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
