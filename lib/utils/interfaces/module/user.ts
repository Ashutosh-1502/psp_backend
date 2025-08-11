import mongoose, { ObjectId } from "mongoose";

export interface UserType {
  email: string;
  name: {
    first: string;
    last: string;
  };
  roles: string;
  referralCode: string;
  companyRef: ObjectId;
  _id: ObjectId;
  stripeCustomerId?: string;
  fullName?: string;
}

export type ObjectIdType = mongoose.Types.ObjectId;

export type UserProfileUpdate = {
  name?: { first?: string; last?: string };
};
