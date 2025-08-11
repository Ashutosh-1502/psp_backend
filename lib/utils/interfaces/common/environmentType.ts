import { ENV } from "@/utils/enums/enums";

export type EnvConfigType = {
  // Database Configuration
  DB_PATH: string;
  BACKUP_PATH: string;
  LOCAL_DB_FILE: string;

  // Server Configuration
  NODE_ENV: ENV;
  PORT: string;
  CRON_PORT: string;
  HOST: string;
  FRONTEND_HOST: string;
  FRONTEND_INVITE_URL: string;
  JWT_SECRET: string;
  ALLOWED_ORIGINS: string;

  // Request timeout
  REQUEST_TIMEOUT: number;

  // Number of test data
  NUM_TEST_DATA: number;
};
