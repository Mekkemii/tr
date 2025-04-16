import React, { useState, useEffect } from "react";

const Daily100Tracker = () => {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");

  // Загрузка прогресса при инициализации
  useEffect(() => {
    const saved = localStorage.getItem("daily100") || 0;
    setCount(Number(saved));
  }, []);

  // Сохраняем прогресс при изменении
  useEffect(() => {
    localStorage.setItem("daily100", count);
  }, [count]);

  const addReps = (amount) => {
    setCount((prev) => Math.min(100, prev + amount));
    setInput("");
  };

  const reset = () => {
    setCount(0);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(input, 10);
    if (!isNaN(num)) {
      addReps(num);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Daily 100 Tracker</h1>
      <p className="mb-2">Выполнено: {count} / 100</p>
      <p className="mb-4">Осталось: {Math.max(0, 100 - count)}</p>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-3 py-2 rounded w-24"
          placeholder="Сколько сделал?"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Добавить
        </button>
      </form>

      <div className="space-x-2 mb-4">
        <button onClick={() => addReps(10)} className="bg-blue-500 text-white px-4 py-2 rounded">+10</button>
        <button onClick={() => addReps(5)} className="bg-green-500 text-white px-4 py-2 rounded">+5</button>
        <button onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded">Сброс</button>
      </div>

      <div className="h-4 bg-gray-300 rounded">
        <div
          className="h-4 bg-blue-600 rounded"
          style={{ width: `${Math.min(100, count)}%`, transition: "width 0.3s" }}
        />
      </div>
    </div>
  );
};

export default Daily100Tracker;
