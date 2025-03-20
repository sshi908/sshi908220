"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ExperimentDisplayComponent({
  experimentId,
}: {
  experimentId: string;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWords, setCurrentWords] = useState<
    [string | null, string | null]
  >([null, null]);
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await axios.get(`/api/experiments/${experimentId}`);
        setWords([
          response.data.seedWord,
          ...response.data.words.map((word: { word: string }) => word.word),
        ]);
        setIndex(1);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    }
    fetchWords();
  }, [experimentId]);

  useEffect(() => {
    if (words.length === 0) return;

    setCurrentWords([null, words[0]]);

    const updateIndex = () => {
      setIndex((prevIndex) => {
        if (prevIndex >= words.length - 1) {
          setShowButton(true);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    };

    const timer = setTimeout(updateIndex, Math.random() * (6000 - 3000) + 3000);
    return () => clearTimeout(timer);
  }, [words, index, router, experimentId]);

  useEffect(() => {
    if (index > 0) {
      setCurrentWords([words[index - 1] || null, words[index] || null]);
    }
  }, [index, words]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="relative w-full max-w-2xl h-48 flex items-center justify-center">
        <div className="absolute left-1/4 transform -translate-x-1/2 text-6xl text-gray-500">
          {currentWords[0] ?? ""}
        </div>
        <div className="absolute right-1/4 transform translate-x-1/2 text-8xl font-bold text-black">
          {currentWords[1] ?? ""}
        </div>
      </div>
      {showButton && (
        <div>
          <button
            onClick={() => router.push(`/experiments/rating/${experimentId}`)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            평가 시작하기
          </button>
          <button
            onClick={() => router.push(`/experiments`)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            실험 목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
