import express from "express";
import http from "http";
import cron from "node-cron";
import envConfig from "@/utils/configuration/environment";
import { deletePreviousMonthEntries } from "@/cron/helper/errorLogs";
import { connectDB, disconnectDB } from "@/db";

const startCronServer = () => {
  try {
    connectDB();

    const app = express();

    app.set("port", envConfig.CRON_PORT);

    const server = http.createServer(app);

    // Cron job to run at the start of every month (1st day at midnight)
    cron.schedule("0 0 1 * *", () => {
      deletePreviousMonthEntries();
    });

    server.listen(envConfig.CRON_PORT, () => {
      console.info(
        "Cron server is running on localhost:" + envConfig.CRON_PORT,
      );
    });
  } catch (error) {
    disconnectDB();
    process.exit(1);
  }
};

startCronServer();
