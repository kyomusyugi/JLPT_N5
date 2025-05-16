"use client";

import { useState, useEffect } from "react";

export type Word = {
  kanji: string;
  hiragana: string;
  meaning: string;
};

function shuffle(array: Word[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

type AnswerRecord = {
  word: Word;
  userKanji: string;
  userHiragana: string;
  isCorrect: boolean;
};

export default function QuizPage({
  words,
  onBack,
}: {
  words: Word[];
  onBack: () => void;
}) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userKanji, setUserKanji] = useState("");
  const [userHiragana, setUserHiragana] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [enterEnabled, setEnterEnabled] = useState(false);

  useEffect(() => {
    const shuffled = shuffle(words);
    setShuffledWords(shuffled);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];

  const normalize = (text: string) =>
    text
      .trim()
      .replace(/\s/g, "")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = () => {
    if (!currentWord || isComposing) return;

    const userAnswers = normalize(userKanji);
    const correctAnswers = normalize(currentWord.meaning);

    const meaningMatch = userAnswers.some((answer) =>
      correctAnswers.includes(answer)
    );

    const isKanaOnly = (text: string) => /^[\u3040-\u30FF]+$/.test(text);
    const requiresHiragana = !isKanaOnly(currentWord.kanji);

    const userHiraganaNormalized = normalize(userHiragana);
    const correctHiraganaNormalized = normalize(currentWord.hiragana);

    const hiraganaMatch = requiresHiragana
      ? userHiraganaNormalized.some((answer) =>
          correctHiraganaNormalized.includes(answer)
        )
      : true;

    const correct = meaningMatch && hiraganaMatch;

    setIsCorrect(correct);
    setShowFeedback(true);
    setEnterEnabled(true);

    const answerRecord: AnswerRecord = {
      word: currentWord,
      userKanji,
      userHiragana,
      isCorrect: correct,
    };

    setAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNext = () => {
    if (isComposing) return;

    const nextIndex = currentIndex + 1;

    setUserKanji("");
    setUserHiragana("");
    setShowFeedback(false);
    setIsCorrect(false);
    setEnterEnabled(false);

    if (nextIndex < shuffledWords.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowResult(true);
    }
  };

  const onKeyDownKanji = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isComposing) return;
      if (!showFeedback) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const onKeyDownHiragana = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isComposing) return;
      if (showFeedback && enterEnabled) {
        e.preventDefault();
        handleNext();
      }
    }
  };

  if (shuffledWords.length === 0) return <div className="p-4">로딩 중...</div>;

  if (showResult) {
    const incorrectAnswers = answers.filter((a) => !a.isCorrect);
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">퀴즈 완료!</h1>
        <p className="text-lg mb-4">
          점수: {answers.filter((a) => a.isCorrect).length} / {answers.length}
        </p>
        {incorrectAnswers.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-2">틀린 문제 정리</h2>
            <ul className="space-y-3">
              {incorrectAnswers.map((item, idx) => (
                <li key={idx} className="bg-white p-4 rounded shadow">
                  <p>
                    <strong>문제 단어:</strong> {item.word.kanji}
                  </p>
                  <p>
                    <strong>정답 의미:</strong> {item.word.meaning}
                  </p>
                  <p>
                    <strong>정답 히라가나:</strong> {item.word.hiragana}
                  </p>
                  <p>
                    <strong>당신의 답 (뜻):</strong> {item.userKanji}
                  </p>
                  <p>
                    <strong>당신의 답 (히라가나):</strong> {item.userHiragana}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-green-600 font-semibold">모든 문제를 정확히 맞혔어요! 🎉</p>
        )}
        <button
          onClick={onBack}
          className="mt-6 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          문제 {currentIndex + 1} / {shuffledWords.length}
        </p>
        <h2 className="text-xl font-bold">{currentWord.kanji}</h2>
      </div>
      <input
        type="text"
        placeholder="뜻 입력"
        value={userKanji}
        onChange={(e) => setUserKanji(e.target.value)}
        disabled={showFeedback}
        className="w-full mb-2 p-2 border rounded"
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={onKeyDownKanji}
        onFocus={() => setEnterEnabled(false)}
      />
      <input
        type="text"
        placeholder="히라가나 입력"
        value={userHiragana}
        onChange={(e) => setUserHiragana(e.target.value)}
        disabled={showFeedback}
        className="w-full mb-4 p-2 border rounded"
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={onKeyDownHiragana}
        onFocus={() => setEnterEnabled(false)}
      />
      {!showFeedback ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          제출
        </button>
      ) : (
        <div className="space-y-3">
          <p
            className={`text-center font-semibold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "정답입니다! 🎉" : "오답입니다."}
          </p>
          <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
            <p>
              <strong>정답 의미:</strong> {currentWord.meaning}
            </p>
            <p>
              <strong>정답 히라가나:</strong> {currentWord.hiragana}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            다음 문제
          </button>
        </div>
      )}
    </div>
  );
}
