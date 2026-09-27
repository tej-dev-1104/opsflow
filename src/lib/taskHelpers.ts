import {
  addDays,
  isBefore,
  isToday,
  isTomorrow,
  isFuture,
  parseISO,
  startOfDay,
  format,
  differenceInCalendarDays,
} from 'date-fns';
import type { Task, TaskPriority, TaskStatus } from '../types';

const priorityRank: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function parseDueDate(dueDate: string): Date {
  return startOfDay(parseISO(dueDate));
}

export function todayISO(offsetDays = 0): string {
  return format(addDays(new Date(), offsetDays), 'yyyy-MM-dd');
}

export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'completed') return false;
  return isBefore(parseDueDate(task.due_date), startOfDay(new Date()));
}

export function isTaskDueToday(task: Task): boolean {
  if (task.status === 'completed') return false;
  return isToday(parseDueDate(task.due_date));
}

export function isTaskUpcoming(task: Task): boolean {
  if (task.status === 'completed') return false;
  return isFuture(parseDueDate(task.due_date));
}

export function isTaskActive(task: Task): boolean {
  return task.status !== 'completed';
}

export function formatDueDate(dueDate: string): string {
  const date = parseDueDate(dueDate);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
}

export function formatTimestamp(value: string): string {
  try {
    return format(parseISO(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
}

export function overdueLabel(dueDate: string): string {
  const days = differenceInCalendarDays(startOfDay(new Date()), parseDueDate(dueDate));
  if (days <= 0) return 'Due today';
  if (days === 1) return '1 day overdue';
  return `${days} days overdue`;
}

export function urgencyRank(task: Task): number {
  if (task.status === 'completed') return 3;
  if (isTaskOverdue(task)) return 0;
  if (isTaskDueToday(task)) return 1;
  return 2;
}

export function compareTasks(a: Task, b: Task): number {
  const urgency = urgencyRank(a) - urgencyRank(b);
  if (urgency !== 0) return urgency;
  const priority = priorityRank[a.priority] - priorityRank[b.priority];
  if (priority !== 0) return priority;
  return a.due_date.localeCompare(b.due_date);
}

export function priorityLabel(priority: TaskPriority): string {
  return priority.toUpperCase();
}

export function statusLabel(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
  }
}

export function greetingForNow(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
