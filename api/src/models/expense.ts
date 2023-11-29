import mongoose, { Schema, Types, Document, Model } from "mongoose";
import ExpenseTagModel from "./expenseTag.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";

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
  tags?: string[];
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
      type: [String],
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

ExpenseSchema.pre<ExpenseDocument>("validate", async function (next) {
  const tags = await ExpenseTagModel.find({
    descriptiveId: { $in: this.tags },
  });

  // Reject if there are tags that were not found
  if (this.tags.length !== tags.length)
    next(new ApiError(ErrorCode.TAG_NOT_FOUND));

  next();
});

const ExpenseModel: Model<ExpenseDocument> = mongoose.model<ExpenseDocument>(
  "Expense",
  ExpenseSchema
);

export default ExpenseModel;
