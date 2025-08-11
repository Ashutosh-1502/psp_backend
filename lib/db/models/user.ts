import mongoose from "mongoose";
import { STATUS, USER_TYPE } from "@/utils/enums/enums";

const ObjectId = mongoose.Schema.Types.ObjectId;

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: {
    first: string;
    last: string;
  };
  get: (path: string) => any;
  set: (path: string, value: any) => any;
  roles: USER_TYPE;
  status: STATUS;
  fullName: string;
  isAdmin: boolean;
  companyRef?: mongoose.Types.ObjectId;
  sequences?: mongoose.Types.ObjectId[];
  lastActivity?: Date;
}

export interface IUserDocument extends Omit<Document, "images">, IUser {
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      first: {
        type: String,
      },
      last: {
        type: String,
      },
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      enum: Object.values(USER_TYPE),
      default: USER_TYPE.USER,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.UNBLOCKED,
    },
    companyRef: {
      type: ObjectId,
      ref: "Company",
      required: false,
    },
    sequences: {
      type: [ObjectId],
      ref: "Sequence",
      default: [],
      required: false
    },
     lastActivity: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.pre<IUser>("save", function (next: any): void {
  if (!this.roles || this.roles.length === 0) {
    this.roles = USER_TYPE.USER;
  }
  next();
});

UserSchema.virtual("fullName").get(function (): string {
  return `${this.name.first} ${this.name.last}`;
});

UserSchema.virtual("isAdmin").get(function (): boolean {
  return this.roles.includes(USER_TYPE.ADMIN);
});

UserSchema.index({
  email: "text",
  "name.first": "text",
  "name.last": "text",
});

export const User = mongoose.model<IUserDocument>("User", UserSchema);
