"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardStats from "@/components/dashboard/DashboardStats";
import LogoutButton from "@/components/ui/LogoutButton";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }

    const dummyUser = {
      name: "Test User",
      email: "test@example.com",
    };
    setUser(dummyUser);

    // Load tasks from localStorage or fallback dummy tasks
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks([
        { id: 1, title: "Task 1", completed: true },
        { id: 2, title: "Task 2", completed: false },
        { id: 3, title: "Task 3", completed: true },
      ]);
    }

    setLoading(false);
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Redirecting to login...</div>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/project")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + New Project
          </button>
          <LogoutButton />
        </div>
      </div>
      <p className="mb-4 text-gray-600">Email: {user.email}</p>

      {/* Stats section */}
      <DashboardStats totalTasks={totalTasks} completedTasks={completedTasks} />
    </div>
  );
}
