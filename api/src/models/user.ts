import mongoose, { Schema, Model, Types, Document } from "mongoose";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";
import bcryptjs from "bcryptjs";

export interface User {
  username: string;
  password: string;
  name?: {
    first: string;
    middle?: string;
    last: string;
    suffix?: string;
  };
}

export interface UserDocument extends User, Document {}

interface UserModelInterface extends Model<UserDocument> {
  signup(userInfo: User): Promise<UserDocument>;
}

const UserSchema: Schema<UserDocument, UserModelInterface> = new Schema<
  UserDocument,
  UserModelInterface
>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: {
        first: {
          type: String,
          required: true,
        },
        last: {
          type: String,
          required: true,
        },
        middle: String,
        suffix: String,
      },
    },
  },
  { timestamps: true }
);

/**
 * Creates a user account
 * @param userInfo The account info of the user
 * @returns The newly-created user account
 */
UserSchema.statics.signup = async function (
  userInfo: User
): Promise<UserDocument> {
  const { username, password, name } = userInfo;
  const UserModel = this as Model<UserDocument>;

  // Fetch a user with the same username
  const existingUser = await UserModel.findOne({ username });

  // Reject if the username is already taken
  if (existingUser) throw new ApiError(ErrorCode.USERNAME_IN_USE);

  // Fetch the salt rounds from .env and generate a salt
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const salt = await bcryptjs.genSalt(saltRounds);

  // Hash and salt the password
  const hash = await bcryptjs.hash(password, salt);

  // Create the user
  const user = await UserModel.create({
    username,
    password: hash,
    name,
  });

  return user;
};

const UserModel: UserModelInterface = mongoose.model<
  UserDocument,
  UserModelInterface
>("User", UserSchema);

export default UserModel;
