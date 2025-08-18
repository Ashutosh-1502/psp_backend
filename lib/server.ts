import http from "http";
import { createApp } from "@/index";
import envConfig from "@/utils/configuration/environment";
import { connectDB } from "@/db/index";
import { Server, Socket } from "socket.io";

try {
  const app = createApp();

  connectDB();

  app.set("port", envConfig.PORT);
  console.log(envConfig.PORT, envConfig.FRONTEND_HOST)

  // Using separate http module for creating server to have
  // advanced control over behavior of server

  const server = http.createServer(app);

  //Initialize Socket.io

  const io = new Server(server, {
    cors: {
      origin: envConfig.FRONTEND_HOST,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
  });

  //handle socket connection
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  //make io available inside routes and controllers
  app.set("io", io);

  server.listen(Number(envConfig.PORT), "0.0.0.0", () =>
    console.info(`API running on 0.0.0.0:${envConfig.PORT}`),
  );
} catch (err) {
  console.error(err, "Error in Server File");
}
