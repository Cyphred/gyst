import { Router } from "express";
import requireUser from "../middleware/requireUser.js";
import globalErrorHandler from "../errorHandlers/globalErrorHandler.js";

const router = Router();

// Routes beyond this line require the user to be logged in
router.use(requireUser);

// Do not put routes or any middleware after this one
router.use(globalErrorHandler);

export default router;
