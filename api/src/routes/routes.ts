import { Router } from "express";
import requireUser from "../middleware/requireUser.js";
import globalErrorHandler from "../errorHandlers/globalErrorHandler.js";
import {
  createExpense,
  updateExpense,
} from "../controllers/expenseController.js";

const router = Router();

// Routes beyond this line require the user to be logged in
router.use(requireUser);

router.post("/expenses", createExpense);
router.put("/expenses", updateExpense);

// Do not put routes or any middleware after this one
router.use(globalErrorHandler);

export default router;
