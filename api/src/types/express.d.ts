import { Document } from "mongoose";
import { UserDocument } from "../models/user.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Document<UserDocument>;
    }
  }
}
