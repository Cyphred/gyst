import { Router } from "express";
import requireUser from "../middleware/requireUser.js";
import globalErrorHandler from "../errorHandlers/globalErrorHandler.js";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "../controllers/expenseController.js";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  updateExpenseCategory,
} from "../controllers/categoryController.js";
import {
  createExpenseTracker,
  deleteExpenseTracker,
  updateExpenseTracker,
} from "../controllers/trackerController.js";

const router = Router();

// Routes beyond this line require the user to be logged in
router.use(requireUser);

router.post("/expenses", createExpense);
router.put("/expenses", updateExpense);
router.delete("/expenses", deleteExpense);

router.post("/expense-categories", createExpenseCategory);
router.put("/expense-categories", updateExpenseCategory);
router.delete("/expense-categories", deleteExpenseCategory);

router.post("/expense-tracker", createExpenseTracker);
router.put("/expense-tracker", updateExpenseTracker);
router.delete("/expense-tracker", deleteExpenseTracker);

// Do not put routes or any middleware after this one
router.use(globalErrorHandler);

export default router;
