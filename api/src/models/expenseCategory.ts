import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ExpenseCategory {
  tracker: Types.ObjectId;
  descriptiveId: string;
  description: string;
  deleted: boolean;
}

export interface ExpenseCategoryDocument extends ExpenseCategory, Document {}

const ExpenseCategorySchema: Schema<ExpenseCategoryDocument> =
  new Schema<ExpenseCategoryDocument>({
    tracker: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseTracker",
      required: true,
    },
    descriptiveId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    deleted: { type: Boolean, default: false },
  });

const ExpenseCategoryModel: Model<ExpenseCategoryDocument> =
  mongoose.model<ExpenseCategoryDocument>(
    "ExpenseCategory",
    ExpenseCategorySchema
  );

export default ExpenseCategoryModel;
