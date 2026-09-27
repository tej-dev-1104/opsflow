export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Employee {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface TaskWithEmployee extends Task {
  employee?: Employee | null;
}

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type CreateEmployeeInput = {
  name: string;
  role: string;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
