import mongoose, { Schema, Types, Model, Document } from "mongoose";

export interface ExpenseTag {
  descriptiveId: string;
  description: string;
  /**
   * Optional list of categories that a tag is exclusive to.
   *
   * If defined, the tag can only be used in the categories in the list.
   */
  exclusiveCategories?: Types.ObjectId[];
}

export interface ExpenseTagDocument extends ExpenseTag, Document {}

const ExpenseTagSchema: Schema<ExpenseTagDocument> =
  new Schema<ExpenseTagDocument>({
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
    exclusiveCategories: {
      type: [Schema.Types.ObjectId],
      ref: "ExpenseCategory",
    },
  });

const ExpenseTagModel: Model<ExpenseTagDocument> =
  mongoose.model<ExpenseTagDocument>("ExpenseTag", ExpenseTagSchema);

export default ExpenseTagModel;
