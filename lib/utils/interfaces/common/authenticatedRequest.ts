import { Request } from "express";
export interface AuthenticatedRequest extends Request {
  user: any;
  params: any;
  body: any;
  token?: string;
  files?: any;
}
