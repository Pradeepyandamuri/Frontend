"use client";

import { useState, useEffect } from "react";
import { Task } from "../../../types/Task";
import { fetchTasks } from "../utils/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

const TaskModal = ({ isOpen, onClose, onSave, initialData }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low">("low");
  const [assignedTo, setAssignedTo] = useState("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedDependencies, setSelectedDependencies] = useState<number[]>([]);

  const getLocalDateTimeString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTasks().then((res) => setAllTasks(res.data));
    }

    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDueDate(initialData.due_date ? getLocalDateTimeString(new Date(initialData.due_date)) : "");
      setPriority(initialData.priority || "low");
      setAssignedTo(initialData.assigned_to_email || "");
      setSelectedDependencies(initialData.dependencies || []);
    } else{
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("low");
      setAssignedTo("");
      setSelectedDependencies([]);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      description,
      due_date: dueDate,
      priority,
      assigned_to_email: assignedTo.trim() || undefined,
      dependencies: selectedDependencies,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-200 max-h-screen overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
          {initialData?.id ? "Edit Task" : "Add New Task"}
        </h2>

        {/* Title */}
        <label className="block mb-4 text-gray-700 font-semibold">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
          />
        </label>

        {/* Description */}
        <label className="block mb-4 text-gray-700 font-semibold">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
          />
        </label>

        {/* Due Date */}
        <label className="block mb-4 text-gray-700 font-semibold">
          Due Date & Time
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
          />
        </label>

        {/* Assigned To */}
        <label className="block mb-4 text-gray-700 font-semibold">
          Assign To (Email)
          <input
            type="email"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="example@email.com"
            className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
          />
        </label>

        {/* Priority */}
        <label className="block mb-4 text-gray-700 font-semibold">
          Priority
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "urgent" | "high" | "medium" | "low")
            }
            className="w-full mt-2 border border-gray-300 p-2 rounded-lg"
          >
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
