import { Request, Response, NextFunction } from "express";
import trackerBelongsToUser from "../common/trackerBelongsToUser.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";
import ExpenseCategoryModel from "../models/expenseCategory.js";
import genericOkResponse from "../common/genericOkResponse.js";

/**
 * Creates an expense category
 */
export const createExpenseCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      trackerId,
      description,
      descriptiveId,
    }: {
      trackerId: string;
      descriptiveId: string;
      description: string;
    } = req.body;

    // Check if the tracker belongs to the user
    const belongs = await trackerBelongsToUser(
      trackerId,
      req.user._id.toString()
    );

    // Reject if the tracker does not belong to the user
    if (!belongs) throw new ApiError(ErrorCode.TRACKER_NOT_FOUND);

    // Creates a category
    const category = await ExpenseCategoryModel.create({
      tracker: trackerId,
      description,
      descriptiveId,
    });

    return genericOkResponse(res, category, "Expense Category created");
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an expense category
 */
export const updateExpenseCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      description,
      descriptiveId,
    }: {
      descriptiveId: string;
      description: string;
    } = req.body;

    const { categoryId } = req.query;

    // Fetch the target category
    const existingCategory = await ExpenseCategoryModel.findOne({
      _id: categoryId,
      deleted: false,
    });

    // Reject if the category _id did not have a match
    if (!existingCategory) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    // Check if the existing category belongs to the user
    const existingBelongs = await trackerBelongsToUser(
      existingCategory.tracker.toString(),
      req.user._id.toString()
    );

    // Reject if the target category does not belong to the user
    if (!existingBelongs) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    // Updates the category
    // Only the description and descriptive id can be updated
    const category = await ExpenseCategoryModel.findOneAndUpdate(
      { _id: existingCategory._id, deleted: false },
      {
        description,
        descriptiveId,
      },
      { new: true }
    );

    // Reject if the target category does not exist
    if (!category) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    return genericOkResponse(res, category, "Expense Category updated");
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes an expense category
 */
export const deleteExpenseCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.query;

    // Fetch the target category
    const existingCategory = await ExpenseCategoryModel.findOne({
      _id: categoryId,
      deleted: false,
    });

    // Reject if the category _id did not have a match
    if (!existingCategory) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    // Check if the existing category belongs to the user
    const existingBelongs = await trackerBelongsToUser(
      existingCategory.tracker.toString(),
      req.user._id.toString()
    );

    // Reject if the target category does not belong to the user
    if (!existingBelongs) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    // Updates the category
    // Only the description and descriptive id can be updated
    const category = await ExpenseCategoryModel.findOneAndUpdate(
      { _id: existingCategory._id, deleted: false },
      { deleted: true },
      { new: true }
    );

    // Reject if the target category does not exist
    if (!category) throw new ApiError(ErrorCode.CATEGORY_NOT_FOUND);

    return genericOkResponse(res, undefined, "Expense Category deleted");
  } catch (err) {
    next(err);
  }
};
