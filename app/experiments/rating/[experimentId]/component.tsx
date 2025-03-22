"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Word {
  id: string;
  word: string;
}

export default function ExperimentRatingComponent({
  experimentId,
}: {
  experimentId: string;
}) {
  const [prevWord, setPrevWord] = useState<string>("");  // 이전 단어 (회색)
  const [currentWord, setCurrentWord] = useState<Word | null>(null);  // 현재 단어 (검은색)
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [negativePositive, setNegativePositive] = useState<number>(0);
  const [relevance, setRelevance] = useState<number>(0);
  const [timePerspective, setTimePerspective] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await axios.get(`/api/experiments/${experimentId}`);
        
        const fetchedWords = response.data.words.map((item: any) => ({
          id: item.id,
          word: item.word,
        }));

        setWords(fetchedWords);

        if (fetchedWords.length > 0) {
          setCurrentWord(fetchedWords[0]); // 첫 단어 설정
        }
      } catch (error) {
        console.error("단어를 불러오는 중 오류 발생:", error);
      }
    }
    fetchWords();
  }, [experimentId]);

  const handleSubmit = async () => {
    if (loading || !currentWord) return;
    setLoading(true);

    try {
      await axios.post(`/api/experiments/ratings/${experimentId}`, {
        prevWord,
        currentWord: currentWord.word,
        negativePositive,
        relevance,
        timePerspective,
      });

      const nextIndex = currentIndex + 1;

      if (nextIndex >= words.length) {
        alert("모든 평가가 완료되었습니다!");
        router.push("/experiments");
      } else {
        setPrevWord(currentWord.word);  // 현재 단어를 이전 단어로 설정
        setCurrentWord(words[nextIndex]);  // 다음 단어로 이동
        setCurrentIndex(nextIndex);
        
        // 슬라이더 값 초기화
        setNegativePositive(0);
        setRelevance(0);
        setTimePerspective(0);
      }
    } catch (error) {
      console.error("평가 저장 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* 단어 표시 (왼쪽: 이전 단어 / 오른쪽: 현재 단어) */}
      <div className="relative w-full max-w-2xl h-48 flex items-center justify-center mb-10">
        {/* 이전 단어 (회색 글씨) */}
        <div className="absolute left-1/4 transform -translate-x-1/2 text-4xl text-gray-500">
          {prevWord || ""}
        </div>

        {/* 현재 단어 (검은 글씨) */}
        <div className="absolute right-1/4 transform translate-x-1/2 text-5xl font-bold text-black">
          {currentWord?.word || ""}
        </div>
      </div>

      {/* Negative-Positive Slider */}
      <div className="w-3/4 mb-6">
        <label>단어를 떠올릴 때 드는 느낌이</label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.001"
          value={negativePositive}
          onChange={(e) => setNegativePositive(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>부정</span>
          <span>중립</span>
          <span>긍정</span>
        </div>
      </div>

      {/* Relevance Slider */}
      <div className="w-3/4 mb-6">
        <label>단어가 자신과 관련된 정도가</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={relevance}
          onChange={(e) => setRelevance(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>전혀 관련 없음</span>
          <span>매우 관련 있음</span>
        </div>
      </div>

      {/* Time Perspective Slider */}
      <div className="w-3/4 mb-6">
        <label>단어가 가장 관련이 높은 자신의 시점은</label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.001"
          value={timePerspective}
          onChange={(e) => setTimePerspective(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>과거</span>
          <span>현재</span>
          <span>미래</span>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-4 py-2 text-white rounded-lg ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {loading ? "저장 중..." : "다음"}
      </button>
    </div>
  );
}



