const kafka = require("kafka-node");
const Event = require("../models/Event");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "events" }], {
  autoCommit: true,
});

consumer.on("message", async (message) => {
  console.log("Received message from Kafka:", message.value);

  try {
    const eventData = JSON.parse(message.value);
    const event = new Event(eventData);
    await event.save();
    console.log("Event saved to MongoDB:", event);
  } catch (err) {
    console.error("Error processing Kafka message:", err);
  }
});

consumer.on("error", (err) => {
  console.error("Kafka Consumer error:", err);
});
