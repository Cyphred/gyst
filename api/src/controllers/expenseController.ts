import { Request, Response, NextFunction } from "express";
import ExpenseModel from "../models/expense.js";
import genericOkResponse from "../common/genericOkResponse.js";
import ExpenseCategoryModel from "../models/expenseCategory.js";
import ExpenseTrackerModel from "../models/expenseTracker.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      date,
      amount,
      description,
      notes,
      tags,
      categoryId,
    }: {
      date: string;
      amount: number;
      description: string;
      notes?: string[];
      tags?: string[];
      categoryId: string;
    } = req.body;

    const category = await ExpenseCategoryModel.findOne({ _id: categoryId });
    const tracker = await ExpenseTrackerModel.findOne({
      _id: category.tracker,
    });

    // Reject if the category and tracker does not belong to the user
    if (tracker.user.toString() !== req.user._id.toString())
      throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    const expense = await ExpenseModel.create({
      date,
      amount,
      description,
      notes,
      tags,
      category,
    });

    return genericOkResponse(res, expense);
  } catch (err) {
    next(err);
  }
};
