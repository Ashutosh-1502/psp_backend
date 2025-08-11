import mongoose from "mongoose";
import envConfig from "@/utils/configuration/environment";
import * as jwt from "jsonwebtoken";

const JWT_SECRET: string = envConfig.JWT_SECRET;

const ObjectId = (value: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(value);
};

const getJWTToken = (payload: object, expiresIn = 7) =>
  jwt.sign({ data: payload }, JWT_SECRET, {
    expiresIn: `${expiresIn}h`,
  });

const generateTokenForAuth = (email: string) => {
  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 168 * 60 * 60, email_id: email },
    JWT_SECRET,
  ); // around 7 days
  return token;
};

function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}


export {
  ObjectId,
  getJWTToken,
  generateTokenForAuth,
  verifyToken,
};
