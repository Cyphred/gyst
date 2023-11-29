import ExpenseTrackerModel from "../models/expenseTracker.js";

/**
 * Checks if a tracker belongs to the provided user.
 * @param trackerId The `_id` of the expense tracker
 * @param userId The `_id` of the user making the request
 * @returns `true` if the tracker belongs to the user. `false` if not.
 */
export default async (trackerId: string, userId: string) => {
  const tracker = await ExpenseTrackerModel.findOne({
    _id: trackerId,
    user: userId,
    deleted: false,
  });

  if (!tracker) return false;

  return true;
};
