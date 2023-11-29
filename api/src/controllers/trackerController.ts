import { Request, Response, NextFunction } from "express";
import ExpenseTrackerModel from "../models/expenseTracker.js";
import genericOkResponse from "../common/genericOkResponse.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";

export const createExpenseTracker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description }: { name: string; description?: string } =
      req.body;

    const tracker = await ExpenseTrackerModel.create({
      user: req.user._id,
      name,
      description,
    });

    return genericOkResponse(res, tracker, "Expense Tracker created");
  } catch (err) {
    next(err);
  }
};

export const updateExpenseTracker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description }: { name: string; description?: string } =
      req.body;

    const { trackerId } = req.query;

    // Update the tracker that belongs to the user
    const tracker = await ExpenseTrackerModel.findOneAndUpdate(
      { _id: trackerId, user: req.user._id, deleted: false },
      {
        name,
        description,
      },
      { new: true }
    );

    // Reject if the tracker does not exist
    if (!tracker) throw new ApiError(ErrorCode.TRACKER_NOT_FOUND);

    return genericOkResponse(res, tracker, "Expense Tracker updated");
  } catch (err) {
    next(err);
  }
};

export const deleteExpenseTracker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { trackerId } = req.query;

    // Update the tracker that belongs to the user
    const tracker = await ExpenseTrackerModel.findOneAndUpdate(
      { _id: trackerId, user: req.user._id, deleted: false },
      { deleted: true },
      { new: true }
    );

    // Reject if the tracker does not exist
    if (!tracker) throw new ApiError(ErrorCode.TRACKER_NOT_FOUND);

    return genericOkResponse(res, undefined, "Expense Tracker deleted");
  } catch (err) {
    next(err);
  }
};
