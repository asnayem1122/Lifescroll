import mongoose, { Schema, Document } from 'mongoose';

export interface IHabitLog extends Document {
  userId: mongoose.Types.ObjectId;
  habitId: mongoose.Types.ObjectId;
  date: string;
  completed: boolean;
  completedAt?: Date;
}

const HabitLogSchema = new Schema<IHabitLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  completedAt: { type: Date },
});

HabitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
HabitLogSchema.index({ userId: 1, date: 1 });

export default mongoose.model<IHabitLog>('HabitLog', HabitLogSchema);
