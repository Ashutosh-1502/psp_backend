import { ObjectId } from "mongoose";

export interface ProductType {
  title?: string;
  productImages?: string[];
  description?: string;
  price?: number;
  costPrice?: number;
  retailPrice?: number;
  salePrice?: number;
  companyRef?: ObjectId;
  userRef?: ObjectId;
  sellerStripeAccountId?: string;
}
