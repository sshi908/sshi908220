"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ExperimentComponent({
  experimentId,
}: {
  experimentId: string;
}) {
  const [experiment, setExperiment] = useState<{
    experimentId: string;
    username: string;
    seedWord: string;
    createdAt: string;
    words: { word: string; ratings: number[] }[];
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchExperimentDetails() {
      try {
        const response = await axios.get(`/api/experiments/${experimentId}`);
        setExperiment(response.data);
      } catch (error) {
        console.error("실험 데이터를 불러오는 중 오류 발생:", error);
      }
    }
    fetchExperimentDetails();
  }, [experimentId]);

  if (!experiment) {
    return (
      <p className="text-gray-600 text-center">실험 데이터를 불러오는 중...</p>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">실험 상세 정보</h1>
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <p className="text-lg text-gray-800">
          <strong>실험 ID:</strong> {experiment.experimentId}
        </p>
        <p className="text-lg text-gray-800">
          <strong>사용자:</strong> {experiment.username}
        </p>
        <p className="text-lg text-gray-800">
          <strong>시드 단어:</strong> {experiment.seedWord}
        </p>
        <p className="text-lg text-gray-800">
          <strong>생성일:</strong>{" "}
          {new Date(experiment.createdAt).toLocaleString()}
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mt-6">단어 & 평가 점수</h2>
      <table className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 mt-4">
        <thead>
          <tr className="bg-gray-200 text-black">
            <th className="py-2 px-4 text-black">단어</th>
            <th className="py-2 px-4 text-black">평가 점수</th>
          </tr>
        </thead>
        <tbody>
          {experiment.words.map((word, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-black text-center">{word.word}</td>
              <td className="py-2 px-4 text-black text-center">
                {word.ratings.length > 0
                  ? word.ratings.join(", ")
                  : "평가 없음"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => router.push("/experiments")}
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800"
      >
        실험 목록으로 돌아가기
      </button>
    </div>
  );
}
