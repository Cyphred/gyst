import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface Expense {
  /**
   * Not to be confused with the `createdAt` and `updatedAt` properties of the document.
   *
   * `date` is the intended/actual date an expense has occurred. This may or may not be
   * on the same date that the expense was logged.
   */
  date: Date;
  amount: number;
  description: string;
  notes?: string[];
  tags?: Types.ObjectId[];
  category: Types.ObjectId;
  deleted: boolean;
}

export interface ExpenseDocument extends Expense, Document {}

const ExpenseSchema: Schema<ExpenseDocument> = new Schema<ExpenseDocument>(
  {
    date: {
      type: Date,
      required: true,
    },
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
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ExpenseModel: Model<ExpenseDocument> = mongoose.model<ExpenseDocument>(
  "Expense",
  ExpenseSchema
);

export default ExpenseModel;
