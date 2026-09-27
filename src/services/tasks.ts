import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { localDb } from '../lib/localDb';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types';

export async function getTasks(): Promise<Task[]> {
  if (!isSupabaseConfigured) return localDb.getTasks();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('getTasks failed:', error);
    throw error;
  }

  return data ?? [];
}

export async function getTask(id: string): Promise<Task | null> {
  if (!isSupabaseConfigured) return localDb.getTask(id);

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getTask failed:', error);
    throw error;
  }

  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  if (!isSupabaseConfigured) return localDb.createTask(input);

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: input.title,
      description: input.description ?? null,
      assigned_to: input.assigned_to ?? null,
      priority: input.priority,
      status: input.status,
      due_date: input.due_date,
    })
    .select()
    .single();

  if (error) {
    console.error('createTask failed:', error);
    throw error;
  }

  return data;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  if (!isSupabaseConfigured) return localDb.updateTask(id, input);

  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateTask failed:', error);
    throw error;
  }

  return data;
}

export async function deleteTask(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localDb.deleteTask(id);
    return;
  }

  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    console.error('deleteTask failed:', error);
    throw error;
  }
}
