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
  const [isStarted, setIsStarted] = useState(false); // 슬라이드 시작 여부를 나타냄

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
    if (words.length === 0 || !isStarted) return;

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

    const timer = setTimeout(updateIndex, 15000);
    return () => clearTimeout(timer);
  }, [words, index, router, experimentId, isStarted]);

  useEffect(() => {
    if (index > 0) {
      setCurrentWords([words[index - 1] || null, words[index] || null]);
    }
  }, [index, words]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        setIsStarted(true); // 's' 키를 누르면 슬라이드 시작
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isStarted) {
    // 슬라이드가 시작되지 않은 상태 (십자가 표시)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="text-white text-6xl">+</div>
        <div className="text-gray-500 mt-4"></div>
      </div>
    );
  }

  // 슬라이드가 시작된 후 화면 표시
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black w-full">
      <div className="relative w-full max-w-2xl h-48 flex items-center justify-center">
        <div className="absolute left-1/4 transform -translate-x-1/2 text-6xl text-gray-500">
          {currentWords[0] ?? ""}
        </div>
        <div className="absolute right-1/4 transform translate-x-1/2 text-8xl font-bold text-white">
          {currentWords[1] ?? ""}
        </div>
      </div>
      {showButton && (
        <div>
          <button
            onClick={() => router.push(`/experiments/rating/${experimentId}`)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            시작하기
          </button>
          <button
            onClick={() => router.push(`/experiments`)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
