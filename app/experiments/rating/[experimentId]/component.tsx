"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExperimentRatingComponent({
  experimentId,
}: {
  experimentId: string;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [seedWord, setSeedWord] = useState<string>("");
  const [ratings, setRatings] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await axios.get(`/api/experiments/${experimentId}`);
        setWords(
          response.data.words.map((word: { word: string }) => word.word)
        );
        setSeedWord(response.data.seedWord);
        setRatings(Array(response.data.words.length).fill(5));
      } catch (error) {
        console.error("단어를 불러오는 중 오류 발생:", error);
      }
    }
    fetchWords();
  }, [experimentId]);

  const handleRatingChange = (index: number, value: number) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[index] = value;
      return newRatings;
    });
  };

  const handleSaveRatings = async () => {
    try {
      await axios.post(`/api/experiments/ratings/${experimentId}`, {
        ratings,
      });
      alert("평가가 성공적으로 저장되었습니다!");
      router.push("/experiments");
    } catch (error) {
      console.error("평가 저장 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {seedWord} 실험 결과 평가
      </h1>
      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {words.map((word, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <span className="text-lg font-medium text-gray-800">{word}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={ratings[index]}
              onChange={(e) =>
                handleRatingChange(index, parseInt(e.target.value))
              }
              className="ml-4 w-32"
            />
            <span className="ml-2 text-gray-700">{ratings[index]}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSaveRatings}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        평가 저장
      </button>
    </div>
  );
}
