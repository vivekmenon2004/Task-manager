import type { Task, TaskInput } from '@/types/task';

const priorities = new Set(['LOW', 'MEDIUM', 'HIGH']);

function getApiUrl(path: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  return `${apiUrl.replace(/\/+$/, '')}${path}`;
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(getApiUrl(path), options);
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Network request failed';
    throw new Error(`Unable to reach the Task Manager API: ${details}`);
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (!response.ok) {
    const errorMessage =
      responseBody &&
      typeof responseBody === 'object' &&
      'error' in responseBody &&
      typeof responseBody.error === 'string'
        ? responseBody.error
        : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  if (responseBody === null) {
    throw new Error('The Task Manager API returned an empty or invalid JSON response.');
  }

  return responseBody as T;
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    (typeof task.description === 'string' || task.description === null) &&
    typeof task.priority === 'string' &&
    priorities.has(task.priority) &&
    typeof task.completed === 'boolean' &&
    typeof task.created_at === 'string' &&
    typeof task.updated_at === 'string'
  );
}

async function taskRequest(path: string, options?: RequestInit): Promise<Task> {
  const responseBody = await apiRequest<unknown>(path, options);
  if (!isTask(responseBody)) {
    throw new Error('The Task Manager API returned an invalid task.');
  }
  return responseBody;
}

export async function getTasks(): Promise<Task[]> {
  const responseBody = await apiRequest<unknown>('/api/tasks');
  if (!Array.isArray(responseBody) || !responseBody.every(isTask)) {
    throw new Error('The Task Manager API returned an invalid task list.');
  }
  return responseBody;
}

export function getTask(id: number): Promise<Task> {
  return taskRequest(`/api/tasks/${encodeURIComponent(id)}`);
}

export function createTask(task: TaskInput): Promise<Task> {
  return taskRequest('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

export function updateTask(id: number, task: TaskInput): Promise<Task> {
  return taskRequest(`/api/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

export function completeTask(id: number): Promise<Task> {
  return taskRequest(`/api/tasks/${encodeURIComponent(id)}/complete`, {
    method: 'PATCH',
  });
}

export async function deleteTask(id: number): Promise<void> {
  const responseBody = await apiRequest<unknown>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (
    !responseBody ||
    typeof responseBody !== 'object' ||
    !('message' in responseBody) ||
    typeof responseBody.message !== 'string'
  ) {
    throw new Error('The Task Manager API returned an invalid delete response.');
  }
}
