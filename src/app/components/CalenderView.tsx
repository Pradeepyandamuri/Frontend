// CalendarView.tsx
"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TaskModal from "./TaskModal";
import { Task } from "../../../types/Task";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../utils/api";
import { formatDateTime } from "../utils/formateDateTime";
import { getUser } from "../utils/auth";
import TaskDetailModal from "./TaskDetailModal";

interface User {
  name: string;
  email: string;
}

const CalendarView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [taskCategory, setTaskCategory] = useState<
    "upcoming" | "pending" | "completed"
  >("upcoming");
  const [user, setUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    const response = await fetchTasks();
    setTasks(response.data);
  };

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    if (currentUser) loadTasks();
  }, []);

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#f97316";
      case "medium":
        return "#eab308";
      case "low":
        return "#22c55e";
      default:
        return "#9ca3af";
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    const currentUser = getUser();
    const taskWithUser = {
      ...taskData,
      user_email: currentUser?.email,
      assigned_to_email: taskData.assigned_to_email?.trim() || undefined,
    };
    if (taskData.id) {
      await updateTask(taskData.id, taskWithUser);
    } else {
      await createTask(taskWithUser);
    }
    await loadTasks();
    setShowModal(false);
    setEditTask(null);

    document.getElementById("taskList")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    loadTasks();
  };

  const handleCompleteTask = async (task: Task) => {
    await updateTask(task.id, { ...task, status: "completed" });
    loadTasks();
  };

  const now = new Date();
  const completed = tasks.filter((task) => task.status === "completed");
  const upcoming = tasks.filter(
    (task) => task.status !== "completed" && new Date(task.due_date) > now
  );
  const pending = tasks.filter(
    (task) => task.status !== "completed" && new Date(task.due_date) <= now
  );

  let filteredTasks: Task[] = [];
  if (taskCategory === "upcoming") filteredTasks = upcoming;
  else if (taskCategory === "pending") filteredTasks = pending;
  else if (taskCategory === "completed") filteredTasks = completed;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-screen-xl mx-auto">
      <div className="flex-1 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-800">📅 Task Calendar</h2>
          {user && (
            <button
              onClick={() => {
                setEditTask(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              + Add Task
            </button>
          )}
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={tasks.map((task) => ({
            id: String(task.id),
            title: task.title,
            start: task.due_date,
            color: getPriorityColor(task.priority),
          }))}
          editable={true}
          selectable={true}
          allDaySlot={false}
          eventClick={(info) => {
            const taskId = parseInt(info.event.id);
            const clickedTask = tasks.find((t) => t.id === taskId);
            if (clickedTask) {
              setSelectedTask(clickedTask);
            }
          }}
        />

        <TaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSave={handleSaveTask}
          initialData={editTask || undefined}
        />
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      </div>

      <div className="w-full lg:w-1/3 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">📊 Task Status</h3>

        <div className="flex justify-between gap-2 mb-4">
          {["upcoming", "pending", "completed"].map((cat) => (
            <button
              key={cat}
              onClick={() => setTaskCategory(cat as "upcoming" | "pending" | "completed")}
              className={`flex-1 px-3 py-1 rounded ${
                taskCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 border"
              }`}
            >
              {cat[0].toUpperCase() + cat.slice(1)} Tasks
            </button>
          ))}
        </div>

        <ul id="taskList" className="space-y-3 max-h-[60vh] overflow-y-auto">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="p-3 bg-gray-50 rounded-lg shadow border border-gray-200 flex flex-col"
            >
              <div>
                <p className="font-semibold text-gray-800">{task.title}</p>
                <p className="text-xs text-gray-500">{formatDateTime(task.due_date)}</p>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    ✅ Completed
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditTask(task);
                    setShowModal(true);
                  }}
                  className="text-xs px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarView;
