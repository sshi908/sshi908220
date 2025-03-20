"use client";

import axios from "axios";
import { useState, useEffect } from "react";

export default function SeedWordsPage() {
  const [seedWords, setSeedWords] = useState<{ id: string; word: string }[]>(
    []
  );
  const [newSeedWord, setNewSeedWord] = useState("");

  useEffect(() => {
    async function fetchSeedWords() {
      try {
        const response = await axios.get("/api/seedwords");
        setSeedWords(response.data);
      } catch (error) {
        console.error("시드 단어를 불러오는 중 오류 발생:", error);
      }
    }
    fetchSeedWords();
  }, []);

  const handleAddSeedWord = async () => {
    if (!newSeedWord.trim()) return;
    try {
      const response = await axios.post("/api/seedwords", {
        word: newSeedWord,
      });
      setSeedWords([...seedWords, response.data]);
      setNewSeedWord("");
    } catch (error) {
      console.error("시드 단어를 추가하는 중 오류 발생:", error);
    }
  };

  const handleDeleteSeedWord = async (id: string) => {
    try {
      const confirm = window.confirm("정말로 이 시드 단어를 삭제하시겠습니까?");
      if (!confirm) return;

      await axios.delete(`/api/seedwords?id=${id}`);
      setSeedWords(seedWords.filter((seed) => seed.id !== id));
    } catch (error) {
      console.error("시드 단어를 삭제하는 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">시드 단어 관리</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="새 시드 단어 입력"
          value={newSeedWord}
          onChange={(e) => setNewSeedWord(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-72 text-black"
        />
        <button
          onClick={handleAddSeedWord}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          추가
        </button>
      </div>
      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {seedWords.map((seed) => (
          <li
            key={seed.id}
            className="flex justify-between items-center py-2 border-b last:border-none hover:bg-gray-100 px-2 rounded-lg"
          >
            <span className="text-lg font-medium text-gray-800">
              {decodeURIComponent(seed.word)}
            </span>
            <button
              onClick={() => handleDeleteSeedWord(seed.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
