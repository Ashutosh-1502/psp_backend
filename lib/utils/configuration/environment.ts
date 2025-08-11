import * as dotenv from "dotenv";
import * as path from "path";
import { EnvConfigType } from "@/utils/interfaces/common/environmentType";
import { ENV } from "@/utils/enums/enums";

if (process.env.NODE_ENV === ENV.TEST) {
  dotenv.config({ path: path.resolve(".", ".env.spec") });
} else {
  dotenv.config();
}

const envConfig: EnvConfigType = {
  // Database Configuration
  DB_PATH: process.env.DB_PATH ?? "mongodb://localhost:27017/boilerplate",
  BACKUP_PATH: process.env.BACKUP_PATH,
  LOCAL_DB_FILE: process.env.LOCAL_DB_FILE,

  // Server Configuration
  NODE_ENV: (process.env.NODE_ENV as ENV) ?? ENV.DEVELOPMENT,
  PORT: process.env.PORT ?? "8000",
  CRON_PORT: process.env.CRON_PORT ?? "8001",
  HOST: process.env.HOST ?? "localhost:8000",
  FRONTEND_HOST: process.env.FRONTEND_HOST ?? "localhost:3000",
  FRONTEND_INVITE_URL:
    process.env.FRONTEND_INVITE_URL ?? "http://localhost:3000/signup",
  JWT_SECRET: process.env.JWT_SECRET ?? "i am a tea pot",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? "http://localhost:3000",

  // request timeout (in milliseconds)
  REQUEST_TIMEOUT: Number(process.env.REQUEST_TIMEOUT) ?? 60000,

  // Number of test data
  NUM_TEST_DATA: Number(process.env.NUM_TEST_DATA) ?? 10,
};

export default envConfig;
