import type { Priority, Task } from '@/types/task';

const priorityStyles: Record<Priority, string> = {
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-amber-100 text-amber-800',
  HIGH: 'bg-rose-100 text-rose-800',
};

interface TaskItemProps {
  task: Task;
  busy: boolean;
  onEdit: (task: Task) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, busy, onEdit, onComplete, onDelete }: TaskItemProps) {
  const createdDate = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(task.created_at));

  return (
    <tr className={`border-b border-slate-100 last:border-0 ${task.completed ? 'bg-emerald-50/40' : ''}`}>
      <td className="px-5 py-4 align-top font-medium">
        <span className={task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}>
          {task.title}
        </span>
      </td>
      <td className="max-w-xs px-5 py-4 align-top text-sm text-slate-600">
        {task.description || <span className="text-slate-400">—</span>}
      </td>
      <td className="px-5 py-4 align-top">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </td>
      <td className="px-5 py-4 align-top text-sm">
        <span className={task.completed
          ? 'inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800'
          : 'text-slate-600'}>
          {task.completed ? '✓ Completed' : 'Pending'}
        </span>
      </td>
      <td className="whitespace-nowrap px-5 py-4 align-top text-sm text-slate-500">
        <time dateTime={task.created_at}>{createdDate}</time>
      </td>
      <td className="whitespace-nowrap px-5 py-4 align-top">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={busy}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
          {!task.completed && (
            <button
              type="button"
              onClick={() => onComplete(task.id)}
              disabled={busy}
              className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Complete'}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={busy}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
