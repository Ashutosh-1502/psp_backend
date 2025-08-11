import http from "http";
import { createApp } from "@/index";
import envConfig from "@/utils/configuration/environment";
import { connectDB } from "@/db/index";

try {
  const app = createApp();

  connectDB();

  app.set("port", envConfig.PORT);

  // Using separate http module for creating server to have
  // advanced control over behavior of server

  const server = http.createServer(app);

  server.listen(Number(envConfig.PORT), '0.0.0.0', () =>
  console.info(`API running on 0.0.0.0:${envConfig.PORT}`),
);
} catch (err) {
  console.error(err, "Error in Server File");
}
