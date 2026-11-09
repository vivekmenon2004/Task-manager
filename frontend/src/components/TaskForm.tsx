'use client';

import { useState, type FormEvent } from 'react';
import type { Priority, TaskInput } from '@/types/task';

interface TaskFormProps {
  onSubmit: (task: TaskInput) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSubmit({ title: title.trim(), description: description.trim() || null, priority });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create task.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">New task</h2>
        <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-900">
          Cancel
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Title</span>
          <input
            autoFocus
            required
            maxLength={255}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            placeholder="What needs to get done?"
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Priority</span>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>
        <label className="sm:col-span-3">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Description</span>
          <textarea
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            placeholder="Add a few details (optional)"
          />
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving || title.trim().length === 0}
          className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Create task'}
        </button>
      </div>
    </form>
  );
}
