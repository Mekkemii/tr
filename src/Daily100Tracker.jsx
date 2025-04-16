import React, { useState, useEffect } from "react";

const DEFAULT_EXERCISES = {
  pushups: { label: "Отжимания", goal: 100, icon: "💥", protected: true },
  squats: { label: "Приседания", goal: 100, icon: "🏋️", protected: true },
  kettlebell: { label: "Гиря", goal: 50, icon: "🛡️", protected: true },
  abs: { label: "Пресс", goal: 100, icon: "🔥", protected: true }
};

const Daily100Tracker = () => {
  const [exercises, setExercises] = useState({});
  const [progress, setProgress] = useState({});
  const [inputs, setInputs] = useState({});
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const savedExercises = JSON.parse(localStorage.getItem("exerciseList")) || DEFAULT_EXERCISES;
    const savedProgress = JSON.parse(localStorage.getItem("multiExerciseProgress")) || {};
    setExercises(savedExercises);
    setProgress(savedProgress);
  }, []);

  useEffect(() => {
    localStorage.setItem("exerciseList", JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem("multiExerciseProgress", JSON.stringify(progress));
  }, [progress]);

  const handleInputChange = (e, key) => {
    setInputs({ ...inputs, [key]: e.target.value });
  };

  const addReps = (key, amount) => {
    setProgress((prev) => ({
      ...prev,
      [key]: Math.min(exercises[key].goal, (prev[key] || 0) + amount)
    }));
    setInputs({ ...inputs, [key]: "" });
  };

  const handleSubmit = (e, key) => {
    e.preventDefault();
    const num = parseInt(inputs[key], 10);
    if (!isNaN(num)) {
      addReps(key, num);
    }
  };

  const resetExercise = (key) => {
    setProgress((prev) => ({ ...prev, [key]: 0 }));
    setInputs((prev) => ({ ...prev, [key]: "" }));
  };

  const handleAddExercise = () => {
    const key = newName.toLowerCase().replace(/\s+/g, "_");
    if (!newName || !newGoal || exercises[key]) return;
    const updated = {
      ...exercises,
      [key]: {
        label: newName,
        goal: parseInt(newGoal),
        icon: "⚔️",
        protected: false
      }
    };
    setExercises(updated);
    setProgress({ ...progress, [key]: 0 });
    setNewName("");
    setNewGoal("");
  };

  const handleRemoveExercise = (key) => {
    if (exercises[key]?.protected) return;
    const updated = { ...exercises };
    delete updated[key];

    const updatedProgress = { ...progress };
    delete updatedProgress[key];

    setExercises(updated);
    setProgress(updatedProgress);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl mb-4 text-center">🎮 Daily 100 System</h1>
      <p className="text-center text-xl mb-6 text-[#00ffc6]">⚔️ Создай свою тренировку, охотник!</p>

      <div className="mb-8 border p-4 rounded">
        <h2 className="text-2xl mb-3">➕ Добавить упражнение</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Название"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-3 py-2 rounded w-full sm:w-1/2"
          />
          <input
            type="number"
            placeholder="Цель (шт)"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="px-3 py-2 rounded w-full sm:w-1/4"
          />
          <button onClick={handleAddExercise} className="px-4 py-2 rounded">Добавить</button>
        </div>
      </div>

      {Object.entries(exercises).map(([key, { label, goal, icon, protected: isProtected }]) => {
        const done = progress[key] || 0;
        const remaining = Math.max(0, goal - done);
        const completed = done >= goal;
        return (
          <div key={key} className="exercise-card relative">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl mb-1">{icon} {label}</h2>
              {!isProtected && (
                <button
                  onClick={() => handleRemoveExercise(key)}
                  className="text-red-400 border border-red-400 px-2 py-1 rounded text-sm"
                >
                  Удалить
                </button>
              )}
            </div>
            <p className="mb-1">Выполнено: {done} / {goal}</p>
            <p className="mb-3 text-sm text-[#00ffc6]">Осталось: {remaining}</p>

            <form onSubmit={(e) => handleSubmit(e, key)} className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputs[key] || ""}
                onChange={(e) => handleInputChange(e, key)}
                className="px-3 py-1 rounded w-24"
                placeholder="Сколько?"
              />
              <button type="submit" className="px-4 py-1 rounded">Добавить</button>
            </form>

            <div className="flex gap-2 mb-2">
              <button onClick={() => addReps(key, 10)} className="px-3 py-1 rounded">+10</button>
              <button onClick={() => addReps(key, 5)} className="px-3 py-1 rounded">+5</button>
              <button onClick={() => resetExercise(key)} className="px-3 py-1 rounded">Сброс</button>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(done / goal) * 100}%` }}
              />
            </div>

            {completed && (
              <div className="absolute top-2 right-2 bg-[#00ffc6] text-black px-3 py-1 rounded shadow animate-pulse">
                🏆 Выполнено!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Daily100Tracker;
