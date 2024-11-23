from locust import HttpUser, task, between
import random

class DataVolumeTestUser(HttpUser):
    wait_time = between(1, 5)  

    @task
    def login(self):
        response = self.client.post("/auth/login", json={
            "username": "test",
            "password": "test"
        })
        if response.status_code == 200:
            print("Login successful!")

    @task
    def create_event(self):
        payload = {
        "sessionId": str(random.randint(1, 100000)),
        "page": "homepage",
        "actionType": "click", 
        "data": {"details": "Test action details"},  
        }
        response = self.client.post("/events/add", json=payload)
        if response.status_code != 201:
            print(f"Failed to create event: {response.status_code} - {response.text}")


    @task
    def fetch_events(self):
        self.client.get("/events/statistics")
