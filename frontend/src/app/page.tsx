'use client';

import { useEffect, useState } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { completeTask, createTask, deleteTask, getTasks } from '@/lib/api';
import type { Task, TaskInput } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getTasks()
      .then((loadedTasks) => {
        if (!cancelled) setTasks(loadedTasks);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unknown API error');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function retryLoadTasks() {
    setLoadError(null);
    setLoading(true);
    setReloadKey((currentKey) => currentKey + 1);
  }

  async function handleCreate(taskInput: TaskInput) {
    const createdTask = await createTask(taskInput);
    setTasks((currentTasks) => [createdTask, ...currentTasks]);
    setLoadError(null);
    setShowTaskForm(false);
  }

  async function handleComplete(id: number) {
    setActionError(null);
    setBusyTaskId(id);

    try {
      const updatedTask = await completeTask(id);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to complete task.');
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleDelete(id: number) {
    setActionError(null);
    setBusyTaskId(id);

    try {
      await deleteTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete task.');
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">
              Your workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Task Manager</h1>
            <p className="mt-2 text-sm text-slate-600">Keep your work clear and moving forward.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowTaskForm((isOpen) => !isOpen)}
            aria-expanded={showTaskForm}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            <span aria-hidden="true" className="text-lg leading-none">+</span>
            Add Task
          </button>
        </header>

        {showTaskForm && (
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowTaskForm(false)} />
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">All tasks</h2>
            {!loading && !loadError && (
              <span className="text-sm text-slate-500">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
            )}
          </div>

          {loading ? (
            <p className="px-5 py-12 text-center text-sm text-slate-600">Loading tasks...</p>
          ) : loadError ? (
            <div className="px-5 py-12 text-center">
              <p className="font-medium text-slate-900">Unable to load tasks.</p>
              <p className="mt-1 text-sm text-slate-500">{loadError}</p>
              <button
                type="button"
                onClick={retryLoadTasks}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Retry
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-600">
              No tasks found. Create your first task.
            </p>
          ) : (
            <TaskList
              tasks={tasks}
              busyTaskId={busyTaskId}
              onComplete={(id) => void handleComplete(id)}
              onDelete={(id) => void handleDelete(id)}
            />
          )}
        </section>

        {actionError && (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
            {actionError}
          </p>
        )}
      </div>
    </main>
  );
}
