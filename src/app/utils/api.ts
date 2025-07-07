import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Automatically attach token to each request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tasks API functions
export const fetchTasks = () => API.get("/tasks");
export const createTask = (task: any) => API.post("/tasks", task);
export const deleteTask = (id: number) => API.delete(`/tasks/${id}`);
export const updateTask = (id: number, task: any) => API.put(`/tasks/${id}`, task);
