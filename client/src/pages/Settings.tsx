import { useState } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PageWrapper from '../components/layout/PageWrapper';
import { useHabits } from '../hooks/useHabits';
import type { Habit, HabitFormData } from '../types/habit';
import Skeleton from '../components/ui/Skeleton';

function SortableHabit({
  habit,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  onEdit: (h: Habit) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: habit._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="card p-3 flex items-center gap-3">
      <button {...attributes} {...listeners} style={{ color: 'var(--text-secondary)', cursor: 'grab' }}>
        <GripVertical size={16} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{habit.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--accent-gold)' }}>
            {habit.category}
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{habit.timeOfDay}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onEdit(habit)} className="p-1.5 rounded" style={{ color: 'var(--text-secondary)' }}>
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(habit._id)} className="p-1.5 rounded" style={{ color: 'var(--accent-crimson)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const { habits, loading, create, update, remove, reorder } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [form, setForm] = useState<HabitFormData>({
    name: '',
    category: 'other',
    timeOfDay: 'morning',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex((h) => h._id === active.id);
    const newIndex = habits.findIndex((h) => h._id === over.id);
    const reordered = arrayMove(habits, oldIndex, newIndex);
    reorder(reordered.map((h, i) => ({ id: h._id, order: i })));
  };

  const handleSubmit = async () => {
    if (editing) {
      await update(editing._id, form);
    } else {
      await create(form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', category: 'other', timeOfDay: 'morning' });
  };

  const handleEdit = (habit: Habit) => {
    setEditing(habit);
    setForm({ name: habit.name, category: habit.category, timeOfDay: habit.timeOfDay });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this habit?')) {
      await remove(id);
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Settings" subtitle="Manage your habits and preferences">
        <Skeleton className="h-[60px]" count={8} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage your habits and preferences"
      action={
        <button
          onClick={() => { setEditing(null); setForm({ name: '', category: 'other', timeOfDay: 'morning' }); setShowForm(true); }}
          className="btn btn-gold text-xs"
        >
          <Plus size={14} /> Add Habit
        </button>
      }
    >
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card p-4 mb-4 overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Habit name"
                  className="text-sm"
                />
              </div>
              <div className="min-w-[120px]">
                <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Habit['category'] })}
                  className="text-sm"
                >
                  <option value="prayer">Prayer</option>
                  <option value="study">Study</option>
                  <option value="cp">CP</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="min-w-[120px]">
                <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Time</label>
                <select
                  value={form.timeOfDay}
                  onChange={(e) => setForm({ ...form, timeOfDay: e.target.value as Habit['timeOfDay'] })}
                  className="text-sm"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSubmit} className="btn btn-gold text-xs">
                  <Check size={14} /> {editing ? 'Update' : 'Add'}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-ghost text-xs">
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={habits.map((h) => h._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {habits.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="font-serif italic" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                  No tasks marked today<br />The scroll remains untouched<br />Begin with one step
                </p>
              </div>
            ) : (
              habits.map((habit) => (
                <SortableHabit key={habit._id} habit={habit} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </PageWrapper>
  );
}
