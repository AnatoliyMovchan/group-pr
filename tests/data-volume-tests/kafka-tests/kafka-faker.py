from kafka import KafkaProducer
import json
from faker import Faker
import time
import infokafka 
from datetime import datetime

fake = Faker()
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def generate_event():
    return {
        "sessionId": fake.uuid4(),
        "userId": fake.random_int(min=1, max=1000),
        "page": "homepage",
        "actionType": fake.random_element(elements=("click", "visit")),
        "data": {"details": "Test Kafka"},
        "timestamp": fake.iso8601()
    }

if __name__ == "__main__":
    topic = "user-events"
    total_events = 100000
    print("Producing events...")

    start_time = datetime.now()

    for _ in range(total_events): 
        event = generate_event()
        producer.send(topic, event)
        time.sleep(0.01) 

    end_time = datetime.now()
        
    print("Event generation complete.")

    infokafka.generate_html_report(start_time, end_time, total_events)
