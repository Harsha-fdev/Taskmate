'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardStats({
  totalTasks,
  completedTasks,
}: {
  totalTasks: number;
  completedTasks: number;
}) {
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader>Total Tasks</CardHeader>
        <CardContent className="text-3xl font-bold">{totalTasks}</CardContent>
      </Card>
      <Card>
        <CardHeader>Completed Tasks</CardHeader>
        <CardContent className="text-3xl font-bold">{completedTasks}</CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>Progress</CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-700">{progress}% complete</p>
        </CardContent>
      </Card>
    </div>
  );
}
