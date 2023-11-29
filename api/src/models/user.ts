import mongoose, { Schema, Model, Types, Document } from "mongoose";

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

const UserSchema: Schema<UserDocument> = new Schema<UserDocument>(
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

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  UserSchema
);

export default UserModel;
