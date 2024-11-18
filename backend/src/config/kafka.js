const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "user-monitoring",
  brokers: ["localhost:9092"],
});

module.exports = kafka;
