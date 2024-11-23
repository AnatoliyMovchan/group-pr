from pymongo import MongoClient, InsertOne
from faker import Faker
import time
from datetime import datetime
from multiprocessing import Pool, cpu_count

import infomon


fake = Faker()
client = MongoClient("mongodb://localhost:27017/")
db = client["user_behavior"]
collection = db["events"]


def generate_event():
    return {
        "sessionId": fake.uuid4(),
        "userId": fake.random_int(min=1, max=1000),
        "page": "homepage",
        "actionType": fake.random_element(elements=("click", "visit")),
        "data": {"details": "Test Mongo"},
        "timestamp": fake.iso8601()
    }

def generate_bulk_events(batch_size=10000):
    return [generate_event() for _ in range(batch_size)]

def insert_batch(batch_size):
    events = generate_bulk_events(batch_size)
    operations = [InsertOne(event) for event in events]
    collection.bulk_write(operations)

def parallel_data_insertion(total_events=100000, batch_size=10000):
    num_batches = total_events // batch_size
    with Pool(cpu_count()) as pool:
        pool.map(insert_batch, [batch_size] * num_batches)

if __name__ == "__main__":
    total_events = 1000000  
    batch_size = 10000  

    print(f"Inserting {total_events} events into MongoDB in batches of {batch_size}...")
    start_time = datetime.now()

    parallel_data_insertion(total_events, batch_size)

    end_time = datetime.now()
    print(f"Data insertion complete.")

    logs_analysis1, logs_analysis2 = infomon.analyze_mongodb_logs(start_time, end_time,container_name="mongodb")
    infomon.generate_html_report(start_time, end_time, logs_analysis1, logs_analysis2)

