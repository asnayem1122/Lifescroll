import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import CompletionRing from '../components/habits/CompletionRing';
import SealCheckbox from '../components/habits/SealCheckbox';
import StreakBadge from '../components/habits/StreakBadge';
import BrushDivider from '../components/layout/BrushDivider';
import { useHabits } from '../hooks/useHabits';
import { useHabitStatsData } from '../hooks/useHabitStats';
import Skeleton from '../components/ui/Skeleton';

const timeOfDayLabels: Record<string, string> = {
  morning: '🌅 Morning',
  afternoon: '☀️ Afternoon',
  evening: '🌆 Evening',
  night: '🌙 Night',
};

const timeOrder = ['morning', 'afternoon', 'evening', 'night'];

export default function Habits() {
  const { activeHabits, completedCount, completionRate, getLog, toggleLog, toggling, loading } = useHabits();
  const { stats } = useHabitStatsData();

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

  const allDone = activeHabits.length > 0 && completedCount === activeHabits.length;
  const [showCelebration, setShowCelebration] = useState(false);

  // Trigger celebration when all habits are done
  useEffect(() => {
    if (allDone) setShowCelebration(true);
  }, [allDone]);

  return (
    <PageWrapper title="Daily Routine" subtitle="Stamp your seals. Build your streak.">
      <div className="flex flex-col items-center mb-6">
        <CompletionRing percentage={completionRate} size={140} strokeWidth={8} />
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          {completedCount} of {activeHabits.length} seals stamped
        </p>
      </div>

      {/* Full-screen ink splash celebration overlay */}
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
            {/* Ink splash circles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{
                  scale: [0, 1.5 + i * 0.3, 1.2 + i * 0.2],
                  opacity: [0.7, 0.3, 0.08],
                }}
                transition={{
                  duration: 1.2 + i * 0.2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
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
