import os
import datetime
from dateutil.parser import parse

def analyze_kafka_logs(start_time, end_time, container_name="kafka"):
    """
    Fetch and analyze logs from the Kafka Docker container.
    """
    try:
        logs = os.popen(f"docker logs {container_name} 2>&1").read()
        log_lines = logs.splitlines()
        filtered_logs = []
        for log in log_lines:
            try:
                if log.startswith("[2024"):
                    log_time = (log.split(' ')[0]+ ' ' + log.split(' ')[1]).replace('[', '').replace(']', '')
                    log_time = parse(log_time) + datetime.timedelta(hours=2)
                    if start_time.strftime('%Y-%m-%d %H:%M:%S') <= log_time.strftime('%Y-%m-%d %H:%M:%S') <= end_time.strftime('%Y-%m-%d %H:%M:%S'):
                        filtered_logs.append(log)
            except Exception:
                print("e")
                pass
       
        error_logs = [log for log in filtered_logs if "ERROR" in log or "WARN" in log]
        return error_logs
    except Exception as e:
        return str(e)
    

def generate_html_report(start_time, end_time, total_events):
    """
    Generate an HTML report with test results and logs analysis.
    """
    duration = end_time - start_time
    kafka_logs = analyze_kafka_logs(start_time, end_time,container_name="kafka")

    html_content = f"""
    <html>
    <head>
        <title>Kafka Event Generation Test Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            h1 {{ color: #2C3E50; }}
            p {{ font-size: 14px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            table, th, td {{ border: 1px solid #ddd; }}
            th, td {{ padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .log {{ color: red; }}
        </style>
    </head>
    <body>
        <h1>Kafka Event Generation Test Report</h1>
        <p><strong>Test Start Time:</strong> {start_time}</p>
        <p><strong>Test End Time:</strong> {end_time}</p>
        <p><strong>Total Events Produced:</strong> {total_events}</p>
        <p><strong>Elapsed Time:</strong> {duration} seconds</p>
        
        <h2>Kafka Logs Analysis</h2>
        <h3>Errors/Warnings in Kafka Logs</h3>
        <ul>
    """
    if kafka_logs:
        for log in kafka_logs:
            html_content += f"<li class='log'>{log}</li>"
    else:
        html_content += "<li>No errors or warnings found in the logs.</li>"
    
    html_content += """
        </ul>

        <h2>Event Generation Details</h2>
        <p>Events were generated using the Faker library and sent to the Kafka topic <strong>user-events</strong>.</p>
        <h3>Generated Event Structure</h3>
        <pre>
        {
            "sessionId": "UUID",
            "userId": 123,
            "page": "homepage",
            "actionType": "click",
            "data": {"details": "Test Kafka"},
            "timestamp": "2024-11-23T12:34:56Z"
        }
        </pre>
    </body>
    </html>
    """

    with open("tests/data-volume-tests/kafka-tests/report.html", "w") as file:
        file.write(html_content)
    

