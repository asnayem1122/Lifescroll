import mongoose, { Schema, Document } from 'mongoose';

interface ILimit {
  category: string;
  limit: number;
}

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  month: string;
  limits: ILimit[];
}

const BudgetSchema = new Schema<IBudget>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  limits: [{
    category: { type: String, required: true },
    limit: { type: Number, required: true },
  }],
});

BudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', BudgetSchema);
