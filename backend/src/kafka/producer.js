const kafka = require("kafka-node");

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

producer.on("ready", () => {
  console.log("Kafka Producer is ready");

  client.createTopics(
    [
      {
        topic: "events",
        partitions: 1,
        replicationFactor: 1,
      },
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating topic:", err);
      } else {
        console.log("Topic created successfully:", result);
      }
    }
  );
});

producer.on("error", (err) => {
  console.error("Kafka Producer error:", err);
});

const sendMessage = (topic, message) => {
  const payloads = [{ topic, messages: JSON.stringify(message) }];
  producer.send(payloads, (err, data) => {
    if (err) console.error("Error sending Kafka message:", err);
    else console.log("Message sent to Kafka:", data);
  });
};

module.exports = sendMessage;
