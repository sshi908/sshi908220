"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ExperimentDisplayComponent({
  experimentIdList,
}: {
  experimentIdList: string[];
}) {
  const [words, setWords] = useState<{ [key: string]: string[] }>({});
  const [currentWords, setCurrentWords] = useState<
    [string | null, string | null]
  >([null, null]);
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [isStarted, setIsStarted] = useState(false); // 슬라이드 시작 여부를 나타냄
  const [currentExperimentIdIndex, setCurrentExperimentIdIndex] =
    useState<number>(0);

  const currentExperimentId = experimentIdList[currentExperimentIdIndex];

  useEffect(() => {
    async function fetchAllWords() {
      const newWords: { [key: string]: string[] } = {};

      for (const experimentId of experimentIdList) {
        try {
          const response = await axios.get(`/api/experiments/${experimentId}`);
          newWords[experimentId] = [
            response.data.seedWord,
            ...response.data.words.map((word: { word: string }) => word.word),
          ];
        } catch (error) {
          console.error(`Error fetching words for ${experimentId}:`, error);
        }
      }

      setWords(newWords);
    }

    if (experimentIdList?.length > 0) {
      fetchAllWords();
    }
  }, [experimentIdList]);

  useEffect(() => {
    if (!isStarted || !currentExperimentId) return;

    const wordList = words[currentExperimentId] || [];

    if (wordList.length === 0) return;

    setCurrentWords([null, wordList[0]]);

    const updateIndex = () => {
      setIndex((prevIndex) => {
        if (prevIndex >= wordList.length - 1) {
          setShowButton(true);
          return prevIndex;
        }

        setCurrentWords([wordList[prevIndex], wordList[prevIndex + 1]]);
        return prevIndex + 1;
      });
    };

    const timer = setTimeout(updateIndex, 15000);
    return () => clearTimeout(timer);
  }, [isStarted, words, currentExperimentIdIndex, index]);

  useEffect(() => {
    if (!currentExperimentId) return;

    const wordList = words[currentExperimentId] || [];

    if (index > 0) {
      setCurrentWords([wordList[index - 1] || null, wordList[index] || null]);
    }
  }, [index, words, currentExperimentId]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s" || event.key === "ㄴ") {
        setIsStarted(true);
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
            onClick={() =>
              router.push(`/experiments/rating/${currentExperimentId}`)
            }
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
          <button
            onClick={() => {
              setShowButton(false); // 버튼 숨김
              setIndex(0); // 단어 인덱스 초기화

              setCurrentExperimentIdIndex((prev) => prev + 1);
            }}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            다음시드워드
          </button>
        </div>
      )}
    </div>
  );
}
