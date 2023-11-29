import { Request, Response, NextFunction } from "express";
import ExpenseModel from "../models/expense.js";
import genericOkResponse from "../common/genericOkResponse.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";
import categoryBelongsToUser from "../common/categoryBelongsToUser.js";

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

    return genericOkResponse(res, expense, "Expense created");
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an expense document
 */
export const updateExpense = async (
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

    const expenseId = req.query.expenseId as string;

    // Fetch existing expense data
    const existingExpense = await ExpenseModel.findOne({ _id: expenseId });

    // Reject if the expense does not exist
    if (!existingExpense) throw new ApiError(ErrorCode.EXPENSE_NOT_FOUND);

    // Determine if the existing expense belongs to the requestor
    const existingExpenseBelongsToRequestor = await categoryBelongsToUser(
      existingExpense.category.toString(),
      req.user._id.toString()
    );

    // Reject if the expense exists but does not belong to the requestor
    if (!existingExpenseBelongsToRequestor)
      throw new ApiError(ErrorCode.EXPENSE_NOT_FOUND);

    // If the category _id is going to be changed
    if (categoryId !== existingExpense.category.toString()) {
      const belongs = await categoryBelongsToUser(
        categoryId,
        req.user._id.toString()
      );

      // Reject if the user tries to use a category that does not belong
      // to them
      if (!belongs) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);
    }

    // Update the expense data
    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: existingExpense._id },
      {
        date,
        amount,
        description,
        notes,
        tags,
        category: categoryId,
      },
      { new: true }
    );

    return genericOkResponse(res, expense, "Expense updated");
  } catch (err) {
    next(err);
  }
};
