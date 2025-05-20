'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function ProjectPage() {
  const [topic, setTopic] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) as Task[] : [];
    }
    return [];
  });
  const [newTask, setNewTask] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleGenerateTasks = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generateTasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok || !data.tasks) {
        setError(data.error || 'Failed to generate tasks');
        return;
      }

      // Map AI-generated tasks to Task interface with unique ids
      const aiTasks: Task[] = data.tasks.map(
        (task: { title: string; completed: boolean }, index: number) => ({
          id: Date.now() + index,
          title: task.title,
          completed: task.completed,
        })
      );

      setTasks((prev) => [...prev, ...aiTasks]);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while generating tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, task]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearTasks = () => setTasks([]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Back to Dashboard Button */}
      <Link href="/dashboard" className="text-blue-600 hover:underline inline-block mb-4">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Generate Project Tasks
      </h1>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic for AI task generation"
        className="border p-2 w-full rounded mb-2"
      />

      <button
        onClick={handleGenerateTasks}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Tasks'}
      </button>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a manual task"
        className="border p-2 w-full rounded mb-2"
      />

      <button
        onClick={handleAddManualTask}
        className="w-full bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
      >
        Add Manual Task
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {tasks.length > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            {tasks.length} Task{tasks.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={clearTasks}
            className="text-sm text-red-500 hover:underline"
            aria-label="Clear all tasks"
          >
            Clear All
          </button>
        </div>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border p-2 rounded bg-white shadow-sm"
          >
            <span
              onClick={() => toggleTask(task.id)}
              className={`flex-1 cursor-pointer select-none ${
                task.completed ? 'line-through text-gray-400' : ''
              }`}
              aria-pressed={task.completed}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleTask(task.id);
                }
              }}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 ml-4"
              aria-label={`Delete task: ${task.title}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
