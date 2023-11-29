import mongoose, { Schema, Model, Document } from "mongoose";

export interface ExpenseCategory {
  descriptiveId: string;
  description: string;
}

export interface ExpenseCategoryDocument extends ExpenseCategory, Document {}

const ExpenseCategorySchema: Schema<ExpenseCategoryDocument> =
  new Schema<ExpenseCategoryDocument>({
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
  });

const ExpenseCategoryModel: Model<ExpenseCategoryDocument> =
  mongoose.model<ExpenseCategoryDocument>(
    "ExpenseCategory",
    ExpenseCategorySchema
  );

export default ExpenseCategoryModel;
