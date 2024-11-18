const WebSocket = require("ws");
const Event = require("../models/Event");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const event = JSON.parse(message);
    console.log("Received event:", event);

    try {
      const newEvent = new Event(event);
      await newEvent.save();
    } catch (error) {
      console.error("Error saving event:", error.message);
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");
