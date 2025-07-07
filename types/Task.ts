export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string; 
  status: "pending" | "completed";
  priority: "urgent" | "high" | "medium" | "low";
  dependencies?: number[];
  assigned_to_email?: string;
  user_email: string;
}
