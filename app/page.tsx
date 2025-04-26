"use client";

import { useState } from "react";
import { words_01_05 } from "@/lib/words_01_05";
import { words_06_10 } from "@/lib/words_06_10";
import { words_11_15 } from "@/lib/words_11_15";
import { words_16_20 } from "@/lib/words_16_20";
import { words_21_25 } from "@/lib/words_21_25";
import QuizPage from "@/components/quizpage";

const units = {
  "Unit 01~05": words_01_05,
  "Unit 06~10": words_06_10,
  "Unit 11~15": words_11_15,
  "Unit 16~20": words_16_20,
  "Unit 21~25": words_21_25,
};

export default function HomePage() {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  if (selectedUnit) {
    return (
      <QuizPage
        words={units[selectedUnit]}
        onBack={() => setSelectedUnit(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">JLPT N5 퀴즈</h1>
      <p className="mb-4 text-center text-gray-600">풀고 싶은 유닛을 선택하세요:</p>
      <div className="space-y-2">
        {Object.keys(units).map((unitName) => (
          <button
            key={unitName}
            onClick={() => setSelectedUnit(unitName)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {unitName}
          </button>
        ))}
      </div>
    </div>
  );
}
