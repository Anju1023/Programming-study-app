"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { MobileFrame } from "@/components/layout/mobile-frame";
import { motion, AnimatePresence } from "framer-motion";
import { usePyodide } from "@/hooks/use-pyodide";
import { completeLesson } from "@/app/actions/progress";

// クイズコンポーネントのインポート
import { MultipleChoice } from "@/components/quiz/multiple-choice";
import { ParsonsQuiz } from "@/components/quiz/parsons-quiz";
import { CodeQuiz } from "@/components/quiz/code-quiz";
import { ResultScreen } from "@/components/quiz/result-screen";

// クイズの型定義
type QuizType = "choice" | "parsons" | "code";

interface QuizData {
  id: string;
  question: string;
  type: QuizType;
  options?: string[]; // choice用
  initialBlocks?: string[]; // parsons用
  correctOrder?: string[]; // parsons用
  templateCode?: string; // code用
  correctAnswer: string | string[];
}

// モックデータ (後でDBから取得するようにする)
const mockQuizzes: QuizData[] = [
  {
    id: "q1",
    question: "Pythonで画面に文字を表示する関数はどれ？",
    type: "choice",
    options: ["print()", "display()", "show()", "echo()"],
    correctAnswer: "print()",
  },
  {
    id: "q2",
    question: "Hello Python! と出力されるように並び替えてね",
    type: "parsons",
    initialBlocks: ['"Hello Python!"', "print", "(", ")"],
    correctOrder: ["print", "(", '"Hello Python!"', ")"],
    correctAnswer: "print(\"Hello Python!\")",
  },
  {
    id: "q3",
    question: "変数 x に 100 を代入して、x を出力するコードを書いてね",
    type: "code",
    templateCode: "# ここにコードを書いてね\n",
    correctAnswer: "100", // 出力結果で判定
  },
];

export default function LessonPage() {
  const params = useParams();
  const lessonId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { isReady, runPython } = usePyodide();

  const [currentStep, setCurrentStep] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // 状態管理
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // CodeQuiz用
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  const currentQuiz = mockQuizzes[currentStep];
  const progress = ((currentStep + 1) / mockQuizzes.length) * 100;

  // 結果画面が表示されたら進捗を保存
  useEffect(() => {
    if (isFinished && lessonId) {
      const saveProgress = async () => {
        setIsSaving(true);
        try {
          // モックデータなのでlessonIdがDBにない場合のエラーは無視されるかも
          // 本番ではparams.idを使用する
          await completeLesson(lessonId, score, mockQuizzes.length, score * 10);
        } catch (err) {
          console.error("Failed to save progress", err);
        } finally {
          setIsSaving(false);
        }
      };
      saveProgress();
    }
  }, [isFinished, lessonId, score]);

  const handleCheck = async () => {
    let correct = false;

    if (currentQuiz.type === "choice") {
      correct = selectedAnswer === currentQuiz.correctAnswer;
    } else if (currentQuiz.type === "parsons") {
      const userOrder = selectedAnswer as string[];
      correct = userOrder.join("") === (currentQuiz.correctOrder || []).join("");
    } else if (currentQuiz.type === "code") {
      await handleRunCode();
      return;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };

  const handleRunCode = async () => {
    if (!selectedAnswer && currentQuiz.type === "code") return;
    
    setIsCodeRunning(true);
    setCodeError(null);
    try {
      const { result, error } = await runPython(selectedAnswer);
      if (error) {
        setCodeError(error);
        setIsCorrect(false);
        setHearts((prev) => Math.max(0, prev - 1));
      } else {
        setCodeOutput(result);
        const correct = result === currentQuiz.correctAnswer;
        setIsCorrect(correct);
        if (correct) {
          setScore((prev) => prev + 1);
        } else {
          setHearts((prev) => Math.max(0, prev - 1));
        }
      }
      setIsAnswered(true);
    } catch (err: any) {
      setCodeError(err.message);
      setIsCorrect(false);
      setHearts((prev) => Math.max(0, prev - 1));
      setIsAnswered(true);
    } finally {
      setIsCodeRunning(false);
    }
  };

  const handleNext = () => {
    if (currentStep < mockQuizzes.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setCodeOutput(null);
      setCodeError(null);
    } else {
      setIsFinished(true);
    }
  };

  const renderQuiz = () => {
    switch (currentQuiz.type) {
      case "choice":
        return (
          <MultipleChoice
            question={currentQuiz.question}
            options={currentQuiz.options || []}
            selectedOption={selectedAnswer}
            onSelect={setSelectedAnswer}
            isAnswered={isAnswered}
            correctAnswer={currentQuiz.correctAnswer as string}
          />
        );
      case "parsons":
        return (
          <ParsonsQuiz
            question={currentQuiz.question}
            initialBlocks={currentQuiz.initialBlocks || []}
            correctOrder={currentQuiz.correctOrder || []}
            onOrderChange={setSelectedAnswer}
            isAnswered={isAnswered}
          />
        );
      case "code":
        return (
          <CodeQuiz
            question={currentQuiz.question}
            templateCode={currentQuiz.templateCode || ""}
            onCodeChange={setSelectedAnswer}
            isAnswered={isAnswered}
            onRun={handleRunCode}
            isLoading={isCodeRunning}
            output={codeOutput}
            error={codeError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MobileFrame className="bg-white flex flex-col h-screen overflow-hidden">
      {isFinished ? (
        <ResultScreen 
          score={score} 
          totalQuestions={mockQuizzes.length} 
          xpGained={score * 10} 
          onContinue={() => router.push("/learn")} 
        />
      ) : (
        <>
          {/* Header */}
          <header className="px-4 py-6 flex items-center gap-4">
            <button 
              onClick={() => router.push("/learn")}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={28} />
            </button>
            <ProgressBar value={progress} className="flex-1 h-3" />
            <div className="flex items-center gap-1.5 text-duo-red font-bold">
              <Heart size={24} fill="currentColor" />
              <span className="text-lg">{hearts}</span>
            </div>
          </header>

          {/* Question Content */}
          <main className="flex-1 px-6 py-4 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderQuiz()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className={`
            px-6 py-8 border-t-2 transition-colors duration-300
            ${isAnswered ? (isCorrect ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200") : "bg-white border-slate-100"}
          `}>
            <div className="max-w-md mx-auto flex flex-col gap-4">
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isCorrect ? "bg-white text-duo-green" : "bg-white text-duo-red"}
                  `}>
                    {isCorrect ? <CheckCircle2 size={32} /> : <X size={32} />}
                  </div>
                  <div>
                    <h3 className={`text-xl font-black ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {isCorrect ? "正解！すごい！" : "おっと！"}
                    </h3>
                    {!isCorrect && (
                      <p className="text-red-600 font-bold text-sm">
                        {currentQuiz.type === "code" ? "出力が正しくないみたい" : `正解: ${currentQuiz.type === "parsons" ? "正しい順序に並べてね" : currentQuiz.correctAnswer}`}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <Button
                onClick={isAnswered ? handleNext : handleCheck}
                disabled={(!selectedAnswer && currentQuiz.type !== "code") || (isAnswered && hearts === 0)}
                variant={isAnswered ? (isCorrect ? "primary" : "danger") : "primary"}
                className="w-full py-6 text-lg"
              >
                {isAnswered ? (hearts === 0 ? "リトライ" : "次へ") : (currentQuiz.type === "code" ? "実行してチェック" : "チェック")}
              </Button>
            </div>
          </footer>
        </>
      )}
    </MobileFrame>
  );
}
