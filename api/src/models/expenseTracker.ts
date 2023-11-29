import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface ExpenseTracker {
  user: Types.ObjectId;
  name: string;
  description?: string;
  deleted: boolean;
}

export interface ExpenseTrackerDocument extends ExpenseTracker, Document {}

const ExpenseTrackerSchema: Schema<ExpenseTrackerDocument> =
  new Schema<ExpenseTrackerDocument>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      deleted: { type: Boolean, default: false },
      description: String,
    },
    { timestamps: true }
  );

const ExpenseTrackerModel: Model<ExpenseTrackerDocument> = mongoose.model(
  "ExpenseTracker",
  ExpenseTrackerSchema
);

export default ExpenseTrackerModel;
