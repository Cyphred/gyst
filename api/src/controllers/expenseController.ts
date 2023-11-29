import { Request, Response, NextFunction } from "express";
import ExpenseModel from "../models/expense.js";
import genericOkResponse from "../common/genericOkResponse.js";
import ExpenseCategoryModel from "../models/expenseCategory.js";
import ExpenseTrackerModel from "../models/expenseTracker.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";

/**
 * Checks if a category is under a tracker that belongs to the user.
 * @param categoryId The `_id` of the expense category
 * @param userId The `_id` of the user making the request
 * @returns `true` if the tracker and category belongs to the user. `false` if not.
 */
const categoryBelongsToUser = async (categoryId: string, userId: string) => {
  const category = await ExpenseCategoryModel.findOne({ _id: categoryId });
  if (!category) return false;

  const tracker = await ExpenseTrackerModel.findOne({
    _id: category.tracker,
    user: userId,
  });
  if (!tracker) return false;

  return true;
};

/**
 * Creates an expense document
 */
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

    // Check if the category belongs to the user
    const belongs = await categoryBelongsToUser(
      categoryId,
      req.user._id.toString()
    );

    // Reject if the category does not belong to the user
    if (!belongs) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    const expense = await ExpenseModel.create({
      date,
      amount,
      description,
      notes,
      tags,
      category: categoryId,
    });

    return genericOkResponse(res, expense, "Expense updated");
  } catch (err) {
    next(err);
  }
};
