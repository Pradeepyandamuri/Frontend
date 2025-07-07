// components/TaskDetailModal.tsx

"use client";
import { Task } from "../../../types/Task";

interface Props {
  task: Task | null;
  onClose: () => void;
}

const TaskDetailModal = ({ task, onClose }: Props) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg border border-blue-300">
        <h2 className="text-xl font-bold mb-4 text-blue-800">{task.title}</h2>
        <p className="mb-2 text-gray-600"><strong>Description:</strong> {task.description}</p>
        <p className="mb-2 text-gray-600"><strong>Due:</strong> {new Date(task.due_date).toLocaleString()}</p>
        <p className="mb-2 text-gray-600"><strong>Status:</strong> {task.status}</p>
        <p className="mb-2 text-gray-600"><strong>Priority:</strong> {task.priority}</p>
        <p className="mb-4 text-gray-600"><strong>Assigned To:</strong> {task.assigned_to_email || "Self"}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
