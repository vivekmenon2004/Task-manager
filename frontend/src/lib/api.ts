import type { Task, TaskInput } from '@/types/task';

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

  const responseBody: unknown = await response.json().catch(() => null);

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

  return responseBody as T;
}

export function getTasks(): Promise<Task[]> {
  return apiRequest<Task[]>('/api/tasks');
}

export function getTask(id: number): Promise<Task> {
  return apiRequest<Task>(`/api/tasks/${encodeURIComponent(id)}`);
}

export function createTask(task: TaskInput): Promise<Task> {
  return apiRequest<Task>('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

export function updateTask(id: number, task: TaskInput): Promise<Task> {
  return apiRequest<Task>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
}

export function completeTask(id: number): Promise<Task> {
  return apiRequest<Task>(`/api/tasks/${encodeURIComponent(id)}/complete`, {
    method: 'PATCH',
  });
}

export async function deleteTask(id: number): Promise<void> {
  await apiRequest<{ message: string }>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
