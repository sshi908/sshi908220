"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Word {
  id: string;
  word: string;
}

const INIT_SETTING = {
  relevance: 0.5,
  negativePositive: 0,
  timePerspective: 0,
  voluntary: 0,
};

export default function ExperimentRatingComponent({
  experimentIdList,
}: {
  experimentIdList: string[];
}) {
  const router = useRouter();

  const [experimentIndex, setExperimentIndex] = useState(0);
  const [wordMap, setWordMap] = useState<{ [id: string]: Word[] }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [negativePositive, setNegativePositive] = useState(
    INIT_SETTING.negativePositive
  );
  const [relevance, setRelevance] = useState(INIT_SETTING.relevance);
  const [timePerspective, setTimePerspective] = useState(
    INIT_SETTING.timePerspective
  );
  const [voluntary, setVoluntary] = useState(INIT_SETTING.voluntary);
  const [loading, setLoading] = useState(false);

  const [ratingsMap, setRatingsMap] = useState<{
    [experimentId: string]: {
      wordId: string;
      relevance: number;
      negativePositive: number;
      timePerspective: number;
      voluntary: number;
    }[];
  }>({});

  const currentExperimentId = experimentIdList[experimentIndex];
  const currentWordList = wordMap[currentExperimentId] || [];
  const currentWord = currentWordList[currentIndex] || null;
  const prevWord = currentWordList[currentIndex - 1]?.word || "";

  useEffect(() => {
    async function fetchWords() {
      const map: { [id: string]: Word[] } = {};

      for (const id of experimentIdList) {
        try {
          const res = await axios.get(`/api/experiments/${id}`);
          map[id] = res.data.words.map((w: { id: string; word: string }) => ({
            id: w.id,
            word: w.word,
          }));
        } catch (err) {
          console.error("단어 불러오기 오류:", err);
        }
      }

      setWordMap(map);
    }

    if (experimentIdList.length > 0) {
      fetchWords();
    }
  }, [experimentIdList]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentExperimentId]);

  const resetSliders = () => {
    setNegativePositive(INIT_SETTING.negativePositive);
    setRelevance(INIT_SETTING.relevance);
    setTimePerspective(INIT_SETTING.timePerspective);
    setVoluntary(INIT_SETTING.voluntary);
  };

  const handleSubmit = async () => {
    if (!currentWord || loading) return;

    const newRating = {
      wordId: currentWord.id,
      relevance,
      negativePositive,
      timePerspective,
      voluntary,
    };

    const prevRatings = ratingsMap[currentExperimentId] || [];
    const updatedRatings = [...prevRatings, newRating];

    setRatingsMap((prev) => ({
      ...prev,
      [currentExperimentId]: updatedRatings,
    }));

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    resetSliders();

    const isLastWord =
      nextIndex >= currentWordList.length &&
      experimentIndex >= experimentIdList.length - 1;

    const isLastExperiment =
      nextIndex >= currentWordList.length &&
      experimentIndex < experimentIdList.length - 1;

    if (nextIndex >= currentWordList.length) {
      setLoading(true);
      try {
        await axios.post(`/api/experiments/ratings/${currentExperimentId}`, {
          ratings: updatedRatings,
        });

        if (isLastWord) {
          alert("모든 실험이 완료되었습니다!");
          router.push("/experiments");
        } else if (isLastExperiment) {
          setExperimentIndex((prev) => prev + 1);
        }
      } catch (err) {
        console.error("저장 오류:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-12 flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="relative w-full max-w-2xl h-48 flex items-center justify-center mb-10">
        <div className="absolute left-1/4 transform -translate-x-1/2 text-4xl text-gray-500">
          {prevWord}
        </div>
        <div className="absolute right-1/4 transform translate-x-1/2 text-5xl font-bold text-black">
          {currentWord?.word}
        </div>
      </div>

      <div className="w-3/4 text-black">
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

      <div className="w-3/4 text-black">
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

      <div className="w-3/4 text-black">
        <label>단어가 가장 관련이 높은 자신의 시점은</label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.001"
          value={timePerspective}
          onChange={(e) => setTimePerspective(parseFloat(e.target.value))}
          className="w-full"
          disabled={relevance === 0}
        />
        <div className="flex justify-between text-sm mt-1">
          <span>과거</span>
          <span>현재</span>
          <span>미래</span>
        </div>
      </div>

      <div className="w-3/4 text-black">
        <label>이 단어는 나에게</label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.001"
          value={voluntary}
          onChange={(e) => setVoluntary(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>위협적임</span>
          <span>중립적임</span>
          <span>안전함</span>
        </div>
      </div>

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
