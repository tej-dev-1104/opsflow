import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CreateEmployeeInput, CreateTaskInput, Employee, Task, UpdateTaskInput } from '../types';
import * as employeeService from '../services/employees';
import * as taskService from '../services/tasks';
import { isTaskActive, isTaskOverdue } from '../lib/taskHelpers';

type DataContextValue = {
  tasks: Task[];
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  createEmployee: (input: CreateEmployeeInput) => Promise<Employee>;
  getEmployeeName: (id: string | null) => string;
  stats: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
  };
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [taskData, employeeData] = await Promise.all([
        taskService.getTasks(),
        employeeService.getEmployees(),
      ]);
      setTasks(taskData);
      setEmployees(employeeData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Could not load data from Supabase. Check your connection and environment variables.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const created = await taskService.createTask(input);
    setTasks((prev) => [...prev, created].sort((a, b) => a.due_date.localeCompare(b.due_date)));
    return created;
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    const updated = await taskService.updateTask(id, input);
    setTasks((prev) =>
      prev
        .map((task) => (task.id === id ? updated : task))
        .sort((a, b) => a.due_date.localeCompare(b.due_date))
    );
    return updated;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const createEmployee = useCallback(async (input: CreateEmployeeInput) => {
    const created = await employeeService.createEmployee(input);
    setEmployees((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }, []);

  const getEmployeeName = useCallback(
    (id: string | null) => {
      if (!id) return 'Unassigned';
      return employees.find((e) => e.id === id)?.name ?? 'Unknown';
    },
    [employees]
  );

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter((t) => isTaskOverdue(t)).length;
    const active = tasks.filter((t) => isTaskActive(t)).length;
    return {
      total: tasks.length,
      active,
      completed,
      overdue,
    };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      employees,
      loading,
      error,
      refresh,
      createTask,
      updateTask,
      deleteTask,
      createEmployee,
      getEmployeeName,
      stats,
    }),
    [
      tasks,
      employees,
      loading,
      error,
      refresh,
      createTask,
      updateTask,
      deleteTask,
      createEmployee,
      getEmployeeName,
      stats,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
