import { Task } from "../../../types/Task";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Always return a valid headers object
const getAuthHeader = (): Record<string, string> => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {}; // return an empty object that still satisfies the type
};

// ✅ Fetch all tasks
export async function fetchTasks(): Promise<{ data: Task[] }> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  const data = await response.json();
  return { data };
}

// ✅ Create a new task
export async function createTask(taskData: Partial<Task>): Promise<{ data: Task }> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  const data = await response.json();
  return { data };
}

// ✅ Update a task
export async function updateTask(id: number, taskData: Partial<Task>): Promise<{ data: Task }> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  const data = await response.json();
  return { data };
}

// ✅ Delete a task
export async function deleteTask(id: number): Promise<{ data: { message: string } }> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }

  const data = await response.json();
  return { data };
}
