import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { localDb } from '../lib/localDb';
import type { CreateEmployeeInput, Employee, UpdateEmployeeInput } from '../types';

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

export async function updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
  if (!isSupabaseConfigured) return localDb.updateEmployee(id, input);

  const { data, error } = await supabase
    .from('employees')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateEmployee failed:', error);
    throw error;
  }

  return data;
}

export async function deleteEmployee(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localDb.deleteEmployee(id);
    return;
  }

  const { error } = await supabase.from('employees').delete().eq('id', id);

  if (error) {
    console.error('deleteEmployee failed:', error);
    throw error;
  }
}
