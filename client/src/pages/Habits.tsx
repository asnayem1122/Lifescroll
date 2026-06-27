import { useState, useEffect } from 'react';
import { Plus, GripVertical, Pencil, Trash2, Check, X, Settings } from 'lucide-react';
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
import CompletionRing from '../components/habits/CompletionRing';
import SealCheckbox from '../components/habits/SealCheckbox';
import StreakBadge from '../components/habits/StreakBadge';
import BrushDivider from '../components/layout/BrushDivider';
import { useHabits } from '../hooks/useHabits';
import { useHabitStatsData } from '../hooks/useHabitStats';
import type { Habit, HabitFormData } from '../types/habit';
import Skeleton from '../components/ui/Skeleton';

const timeOfDayLabels: Record<string, string> = {
  morning: '🌅 Morning',
  afternoon: '☀️ Afternoon',
  evening: '🌆 Evening',
  night: '🌙 Night',
};

const timeOrder = ['morning', 'afternoon', 'evening', 'night'];

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

export default function Habits() {
  const { habits, activeHabits, completedCount, completionRate, getLog, toggleLog, toggling, loading, create, update, remove, reorder } = useHabits();
  const { stats } = useHabitStatsData();
  const [showCelebration, setShowCelebration] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [form, setForm] = useState<HabitFormData>({
    name: '',
    category: 'other',
    timeOfDay: 'morning',
  });

  const allDone = activeHabits.length > 0 && completedCount === activeHabits.length;

  useEffect(() => {
    if (allDone) setShowCelebration(true);
  }, [allDone]);

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

  const grouped = timeOrder.map((tod) => ({
    label: timeOfDayLabels[tod],
    habits: activeHabits.filter((h) => h.timeOfDay === tod),
  })).filter((g) => g.habits.length > 0);

  if (loading) {
    return (
      <PageWrapper title="Daily Routine" subtitle="Stamp your seals. Build your streak.">
        <Skeleton className="h-[80px]" count={8} />
      </PageWrapper>
    );
  }

  if (manageMode) {
    return (
      <PageWrapper
        title="Manage Habits"
        subtitle="Add, edit, reorder your daily seals"
        action={
          <button onClick={() => { setManageMode(false); setShowForm(false); setEditing(null); }} className="btn btn-gold text-xs">
            <Check size={14} /> Done
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

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setEditing(null); setForm({ name: '', category: 'other', timeOfDay: 'morning' }); setShowForm(true); }}
            className="btn btn-gold text-xs"
          >
            <Plus size={14} /> Add Habit
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={habits.map((h) => h._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {habits.length === 0 ? (
                <div className="card p-10 text-center">
                  <p className="font-serif italic" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                    No habits yet<br />The scroll awaits your ink<br />Add your first seal
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

  return (
    <PageWrapper
      title="Daily Routine"
      subtitle="Stamp your seals. Build your streak."
      action={
        <button onClick={() => setManageMode(true)} className="btn btn-ghost text-xs">
          <Settings size={14} /> Manage
        </button>
      }
    >
      <div className="flex flex-col items-center mb-6">
        <CompletionRing percentage={completionRate} size={140} strokeWidth={8} />
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          {completedCount} of {activeHabits.length} seals stamped
        </p>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
            onClick={() => setShowCelebration(false)}
            style={{ background: 'rgba(8,8,8,0.92)' }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{
                  scale: [0, 1.5 + i * 0.3, 1.2 + i * 0.2],
                  opacity: [0.7, 0.3, 0.08],
                }}
                transition={{ duration: 1.2 + i * 0.2, delay: i * 0.1, ease: 'easeOut' }}
                className="absolute rounded-full"
                style={{
                  width: `${120 + i * 60}px`,
                  height: `${120 + i * 60}px`,
                  background: i % 2 === 0
                    ? 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139,0,0,0.12) 0%, transparent 70%)',
                  filter: 'url(#ink-bleed)',
                }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="relative z-10 text-center px-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.6 }}
                className="mb-6 inline-block"
              >
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <rect x="5" y="5" width="90" height="90" rx="8" ry="8" fill="none" stroke="#d4af37" strokeWidth="3" opacity="0.8" />
                  <rect x="12" y="12" width="76" height="76" rx="4" ry="4" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.5" />
                  <text x="50" y="62" textAnchor="middle" fill="#d4af37" fontFamily="'Noto Serif', serif" fontSize="36" fontWeight="bold" opacity="0.9">✓</text>
                </svg>
              </motion.div>
              <p className="font-serif italic text-lg leading-relaxed" style={{ color: '#d4af37', opacity: 0.9 }}>
                All seals are stamped<br />The scroll of today is full<br />Rest, you have earned it
              </p>
              <p className="text-xs mt-6" style={{ color: '#444' }}>tap anywhere to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeHabits.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-serif italic" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
            No tasks marked today<br />The scroll remains untouched<br />Begin with one step
          </p>
        </div>
      ) : (
        grouped.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 && <BrushDivider />}
            <h3 className="font-serif text-sm mb-3" style={{ color: 'var(--accent-gold)' }}>{group.label}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {group.habits.map((habit) => {
                  const log = getLog(habit._id);
                  const streakData = stats?.streaks[habit._id];
                  return (
                    <motion.div
                      key={habit._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="card p-3 flex items-center gap-3"
                    >
                      <SealCheckbox
                        checked={!!log?.completed}
                        onChange={() => toggleLog(habit._id)}
                        loading={toggling === habit._id}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{habit.name}</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{
                              background: 'rgba(212,175,55,0.1)',
                              color: 'var(--accent-gold)',
                            }}
                          >
                            {habit.category}
                          </span>
                        </div>
                        {streakData && (
                          <StreakBadge current={streakData.current} longest={streakData.longest} />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}
    </PageWrapper>
  );
}
