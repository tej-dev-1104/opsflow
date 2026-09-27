import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { localDb } from '../lib/localDb';
import type { CreateEmployeeInput, Employee } from '../types';

export async function getEmployees(): Promise<Employee[]> {
  if (!isSupabaseConfigured) return localDb.getEmployees();

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('getEmployees failed:', error);
    throw error;
  }

  return data ?? [];
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  if (!isSupabaseConfigured) return localDb.createEmployee(input);

  const { data, error } = await supabase
    .from('employees')
    .insert({
      name: input.name,
      role: input.role,
    })
    .select()
    .single();

  if (error) {
    console.error('createEmployee failed:', error);
    throw error;
  }

  return data;
}
