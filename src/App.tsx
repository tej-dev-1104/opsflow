import { useCallback, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TaskModal } from './components/TaskModal';
import { Toast } from './components/Toast';
import { DataProvider, useData } from './context/DataContext';
import { Dashboard } from './pages/Dashboard';
import { MyWorkPage } from './pages/MyWorkPage';
import { TasksPage } from './pages/TasksPage';
import { TeamPage } from './pages/TeamPage';
import type { CreateTaskInput, Task } from './types';

function AppShell() {
  const { employees, createTask, updateTask, deleteTask } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [prefillTitle, setPrefillTitle] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const openCreate = useCallback((title = '') => {
    setModalMode('create');
    setEditingTask(null);
    setPrefillTitle(title);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setModalMode('edit');
    setEditingTask(task);
    setPrefillTitle('');
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const closeToast = useCallback(() => setToast(null), []);

  const handleSave = async (input: CreateTaskInput) => {
    if (modalMode === 'create') {
      await createTask(input);
      setToast('Task created');
    } else if (editingTask) {
      await updateTask(editingTask.id, input);
      setToast('Task updated');
    }
  };

  const handleDelete = async () => {
    if (!editingTask) return;
    await deleteTask(editingTask.id);
    setToast('Task deleted');
  };

  return (
    <>
      <Layout onNewTask={() => openCreate()}>
        <Routes>
          <Route path="/" element={<Dashboard onOpenTask={openEdit} onQuickAdd={openCreate} />} />
          <Route
            path="/tasks"
            element={<TasksPage onOpenTask={openEdit} onNewTask={() => openCreate()} />}
          />
          <Route path="/my-work" element={<MyWorkPage onOpenTask={openEdit} />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      {modalOpen ? (
        <TaskModal
          mode={modalMode}
          employees={employees}
          initialTask={editingTask}
          initialTitle={prefillTitle}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={modalMode === 'edit' ? handleDelete : undefined}
        />
      ) : null}

      <Toast message={toast} onClose={closeToast} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppShell />
      </DataProvider>
    </BrowserRouter>
  );
}
