const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const cookieParser = require("cookie-parser");
require("./kafka/consumer");
const identifyUser = require("./middleware/identifyUser");
const cors = require("cors");

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.set("io", io);
app.use(express.json());
app.use(cookieParser());
app.use(identifyUser);
app.use(cors({ origin: "http://localhost:3000" }));

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

app.use("/events", eventRoutes);
app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = 4000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
