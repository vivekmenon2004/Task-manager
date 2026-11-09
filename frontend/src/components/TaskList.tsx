import type { Task } from '@/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  busyTaskId: number | null;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ tasks, busyTaskId, onComplete, onDelete }: TaskListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Title</th>
            <th scope="col" className="px-5 py-3 font-semibold">Description</th>
            <th scope="col" className="px-5 py-3 font-semibold">Priority</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3 font-semibold">Created</th>
            <th scope="col" className="px-5 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              busy={busyTaskId === task.id}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
