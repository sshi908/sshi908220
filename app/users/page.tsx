"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [seedWords, setSeedWords] = useState<{ id: string; word: string }[]>(
    []
  );
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchSeedWords() {
      try {
        const response = await axios.get("/api/seedwords");
        setSeedWords(response.data);
      } catch (error) {
        console.error("Error fetching seed words:", error);
      }
    }
    fetchSeedWords();
  }, []);

  const handleAddUser = async () => {
    if (!newUsername.trim()) return;
    try {
      const response = await axios.post("/api/users", {
        username: newUsername,
      });
      setUsers([...users, { id: response.data.id, username: newUsername }]);
      setNewUsername("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleStartExperiment = async (seedWordId: string) => {
    if (!selectedUserId) return;
    try {
      const response = await axios.post("/api/experiments", {
        userId: selectedUserId,
        seedWordId,
      });
      router.push(`/experiments/outside-fmri/${response.data.id}`);
    } catch (error) {
      console.error("Error starting experiment:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Management</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter new username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg text-black"
        />
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Add User
        </button>
      </div>
      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center py-2 border-b last:border-none"
          >
            <button
              onClick={() => handleUserClick(user.id)}
              className="text-lg font-medium text-blue-600 hover:underline"
            >
              {user.username}
            </button>
          </li>
        ))}
      </ul>
      {selectedUserId && (
        <div className="mt-6 w-full max-w-md bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Select a Seed Word to Start an Experiment
          </h2>
          <ul>
            {seedWords.map((seed) => (
              <li key={seed.id} className="py-2">
                <button
                  onClick={() => handleStartExperiment(seed.id)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                >
                  Start Experiment with {decodeURIComponent(seed.word)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
