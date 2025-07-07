import axios from "axios";
import { Task } from "../../../types/Task";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // update if needed

export async function fetchTasks(): Promise<{ data: Task[] }> {
  const response = await axios.get(`${BASE_URL}/tasks`);
  return response;
}

export async function createTask(taskData: Partial<Task>): Promise<{ data: Task }> {
  const response = await axios.post(`${BASE_URL}/tasks`, taskData);
  return response;
}

export async function updateTask(id: number, taskData: Partial<Task>): Promise<{ data: Task }> {
  const response = await axios.put(`${BASE_URL}/tasks/${id}`, taskData);
  return response;
}

export async function deleteTask(id: number): Promise<{ data: { message: string } }> {
  const response = await axios.delete(`${BASE_URL}/tasks/${id}`);
  return response;
}
