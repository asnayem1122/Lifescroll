import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'prayer' | 'study' | 'cp' | 'health' | 'other';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  order: number;
  active: boolean;
  createdAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['prayer', 'study', 'cp', 'health', 'other'],
    required: true,
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night'],
    required: true,
  },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

HabitSchema.index({ userId: 1, order: 1 });

export default mongoose.model<IHabit>('Habit', HabitSchema);
