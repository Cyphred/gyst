import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface Expense {
  amount: number;
  description: string;
  notes?: string[];
  tags?: Types.ObjectId[];
  category: Types.ObjectId;
}

export interface ExpenseDocument extends Expense, Document {}

const ExpenseSchema: Schema<ExpenseDocument> = new Schema<ExpenseDocument>({
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function (amount: number) {
        return amount >= 0;
      },
      message: "Amount cannot be a negative value",
    },
  },
  description: { type: String, required: true },
  notes: {
    type: [String],
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: "ExpenseTag",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "ExpenseCategory",
    required: true,
  },
});

const ExpenseModel: Model<ExpenseDocument> = mongoose.model<ExpenseDocument>(
  "Expense",
  ExpenseSchema
);

export default ExpenseModel;
