import React, { useState, useEffect } from "react";

const EXERCISES = {
  pushups: { label: "Отжимания", goal: 100 },
  squats: { label: "Приседания", goal: 100 },
  kettlebell: { label: "Гиря", goal: 50 },
  abs: { label: "Пресс", goal: 100 }
};

const Daily100Tracker = () => {
  const [progress, setProgress] = useState({});
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("multiExerciseProgress");
    if (saved) {
      setProgress(JSON.parse(saved));
    } else {
      const initial = {};
      for (const key in EXERCISES) initial[key] = 0;
      setProgress(initial);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("multiExerciseProgress", JSON.stringify(progress));
  }, [progress]);

  const handleInputChange = (e, key) => {
    setInputs({ ...inputs, [key]: e.target.value });
  };

  const addReps = (key, amount) => {
    setProgress((prev) => ({
      ...prev,
      [key]: Math.min(EXERCISES[key].goal, (prev[key] || 0) + amount)
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Трекер упражнений</h1>
      {Object.entries(EXERCISES).map(([key, { label, goal }]) => {
        const done = progress[key] || 0;
        const remaining = Math.max(0, goal - done);
        return (
          <div key={key} className="mb-8 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">{label}</h2>
            <p className="mb-1">Выполнено: {done} / {goal}</p>
            <p className="mb-3">Осталось: {remaining}</p>

            <form onSubmit={(e) => handleSubmit(e, key)} className="flex gap-2 mb-3">
              <input
                type="number"
                value={inputs[key] || ""}
                onChange={(e) => handleInputChange(e, key)}
                className="border px-3 py-1 rounded w-24"
                placeholder="Сколько?"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Добавить</button>
            </form>

            <div className="flex gap-2 mb-2">
              <button onClick={() => addReps(key, 10)} className="bg-blue-500 text-white px-3 py-1 rounded">+10</button>
              <button onClick={() => addReps(key, 5)} className="bg-green-500 text-white px-3 py-1 rounded">+5</button>
              <button onClick={() => resetExercise(key)} className="bg-gray-500 text-white px-3 py-1 rounded">Сброс</button>
            </div>

            <div className="h-3 bg-gray-300 rounded">
              <div
                className="h-3 bg-blue-600 rounded"
                style={{ width: `${(done / goal) * 100}%`, transition: "width 0.3s" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Daily100Tracker;
