import type {
  CreateEmployeeInput,
  CreateTaskInput,
  Employee,
  Task,
  UpdateTaskInput,
} from '../types';
import { todayISO } from './taskHelpers';

const EMPLOYEES_KEY = 'opsflow_employees';
const TASKS_KEY = 'opsflow_tasks';

const todayOffset = todayISO;

function uid(): string {
  return crypto.randomUUID();
}

function seedIfNeeded() {
  if (localStorage.getItem(EMPLOYEES_KEY) && localStorage.getItem(TASKS_KEY)) return;

  const employees: Employee[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Ravi Kumar',
      role: 'Sales',
      created_at: new Date().toISOString(),
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Ananya Sharma',
      role: 'Operations',
      created_at: new Date().toISOString(),
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Arjun Reddy',
      role: 'Inventory',
      created_at: new Date().toISOString(),
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Priya Singh',
      role: 'Finance',
      created_at: new Date().toISOString(),
    },
  ];

  const now = new Date().toISOString();
  const tasks: Task[] = [
    {
      id: uid(),
      title: 'Call supplier about delayed shipment',
      description: 'Shipment #ST-4821 is 2 days late. Confirm new ETA and update customer.',
      assigned_to: employees[0].id,
      priority: 'high',
      status: 'todo',
      due_date: todayOffset(-2),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Follow up with customer on unpaid invoice',
      description: 'Invoice INV-1092 overdue. Call and send payment reminder.',
      assigned_to: employees[3].id,
      priority: 'high',
      status: 'in_progress',
      due_date: todayOffset(-5),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Restock packaging materials',
      description: 'Boxes and tape running low in warehouse bay 2.',
      assigned_to: employees[2].id,
      priority: 'medium',
      status: 'todo',
      due_date: todayOffset(-1),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Update inventory counts',
      description: 'Weekly cycle count for SKUs A100–A150.',
      assigned_to: employees[2].id,
      priority: 'medium',
      status: 'todo',
      due_date: todayOffset(0),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Send quotation to ABC Stores',
      description: 'Prepare and email quote for bulk order request received yesterday.',
      assigned_to: employees[0].id,
      priority: 'high',
      status: 'in_progress',
      due_date: todayOffset(0),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Review vendor payment schedule',
      description: 'Confirm next week payments with Priya before end of day.',
      assigned_to: employees[1].id,
      priority: 'medium',
      status: 'todo',
      due_date: todayOffset(0),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Prepare weekly sales report',
      description: "Summarize this week's closed deals and pipeline.",
      assigned_to: employees[0].id,
      priority: 'medium',
      status: 'todo',
      due_date: todayOffset(2),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Schedule delivery for Metro Mart',
      description: 'Coordinate truck for Monday morning delivery.',
      assigned_to: employees[1].id,
      priority: 'high',
      status: 'todo',
      due_date: todayOffset(3),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Update product price list',
      description: 'Apply new wholesale rates from supplier catalog.',
      assigned_to: employees[2].id,
      priority: 'low',
      status: 'todo',
      due_date: todayOffset(5),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Reconcile bank statement',
      description: "Match last month's transactions in books.",
      assigned_to: employees[3].id,
      priority: 'medium',
      status: 'in_progress',
      due_date: todayOffset(4),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Train new warehouse helper',
      description: 'Walk through receiving and put-away process.',
      assigned_to: employees[1].id,
      priority: 'low',
      status: 'todo',
      due_date: todayOffset(7),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Confirm order with Patel Distributors',
      description: 'Order #PD-778 confirmed and payment received.',
      assigned_to: employees[0].id,
      priority: 'high',
      status: 'completed',
      due_date: todayOffset(-3),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'File GST return for last quarter',
      description: 'Return filed and acknowledgment saved.',
      assigned_to: employees[3].id,
      priority: 'high',
      status: 'completed',
      due_date: todayOffset(-7),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Clean and organize storage aisle 3',
      description: 'Completed during Saturday shift.',
      assigned_to: employees[2].id,
      priority: 'low',
      status: 'completed',
      due_date: todayOffset(-4),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Onboard new retail partner',
      description: 'Account created and first catalog shared.',
      assigned_to: employees[1].id,
      priority: 'medium',
      status: 'completed',
      due_date: todayOffset(-2),
      created_at: now,
      updated_at: now,
    },
    {
      id: uid(),
      title: 'Check cold-storage temperature logs',
      description: 'All readings within range for the week.',
      assigned_to: employees[2].id,
      priority: 'medium',
      status: 'completed',
      due_date: todayOffset(-1),
      created_at: now,
      updated_at: now,
    },
  ];

  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function readEmployees(): Employee[] {
  seedIfNeeded();
  return JSON.parse(localStorage.getItem(EMPLOYEES_KEY) || '[]') as Employee[];
}

function writeEmployees(employees: Employee[]) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
}

function readTasks(): Task[] {
  seedIfNeeded();
  return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]') as Task[];
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export const localDb = {
  getEmployees(): Employee[] {
    return readEmployees().sort((a, b) => a.name.localeCompare(b.name));
  },

  createEmployee(input: CreateEmployeeInput): Employee {
    const employee: Employee = {
      id: uid(),
      name: input.name,
      role: input.role,
      created_at: new Date().toISOString(),
    };
    writeEmployees([...readEmployees(), employee]);
    return employee;
  },

  getTasks(): Task[] {
    return readTasks().sort((a, b) => a.due_date.localeCompare(b.due_date));
  },

  getTask(id: string): Task | null {
    return readTasks().find((t) => t.id === id) ?? null;
  },

  createTask(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: uid(),
      title: input.title,
      description: input.description ?? null,
      assigned_to: input.assigned_to ?? null,
      priority: input.priority,
      status: input.status,
      due_date: input.due_date,
      created_at: now,
      updated_at: now,
    };
    writeTasks([...readTasks(), task]);
    return task;
  },

  updateTask(id: string, input: UpdateTaskInput): Task {
    const tasks = readTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0) throw new Error('Task not found');
    const updated: Task = {
      ...tasks[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    tasks[index] = updated;
    writeTasks(tasks);
    return updated;
  },

  deleteTask(id: string): void {
    writeTasks(readTasks().filter((t) => t.id !== id));
  },
};
