import ExpenseCategoryModel from "../models/expenseCategory.js";
import ExpenseTrackerModel from "../models/expenseTracker.js";

/**
 * Checks if a category is under a tracker that belongs to the user.
 * @param categoryId The `_id` of the expense category
 * @param userId The `_id` of the user making the request
 * @returns `true` if the tracker and category belongs to the user. `false` if not.
 */
export default async (categoryId: string, userId: string) => {
  const category = await ExpenseCategoryModel.findOne({
    _id: categoryId,
    deleted: false,
  });
  if (!category) return false;

  const tracker = await ExpenseTrackerModel.findOne({
    _id: category.tracker,
    user: userId,
    deleted: false,
  });
  if (!tracker) return false;

  return true;
};
