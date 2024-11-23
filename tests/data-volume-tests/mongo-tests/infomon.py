import os
import datetime
import json
from dateutil.parser import parse

def analyze_mongodb_logs(start_time, end_time, container_name="mongodb"):
    """
    Fetch and analyze logs from the MongoDB Docker container.
    """
    try:
        logs = os.popen(f"docker logs {container_name} 2>&1").read()
        log_lines = logs.splitlines()
        filtered_logs = []
        for log in log_lines:
            try:
                log_json = json.loads(log)
                log_time = parse(log_json['t']['$date']) + datetime.timedelta(hours=2)
                if start_time.strftime('%Y-%m-%d %H:%M:%S.%f') <= log_time.strftime('%Y-%m-%d %H:%M:%S.%f') <= end_time.strftime('%Y-%m-%d %H:%M:%S.%f'):
                    filtered_logs.append(log)
            except Exception:
                print("a")
                pass

        analysis = {
            "insert_operations": 0,
            "errors": 0,
            "warnings": 0
        }

        for line in filtered_logs:
            if "insert" in line and "user_behavior.events" in line:
                analysis["insert_operations"] += 1
            if "error" in line.lower():
                analysis["errors"] += 1
            if "warning" in line.lower():
                analysis["warnings"] += 1

        insert_lines = [line for line in filtered_logs if "insert" in line.lower() or  "user_behavior" in line.lower()]
        error_lines = [line for line in filtered_logs if "error" in line.lower()]
        warning_operations = [line for line in filtered_logs if "warning" in line.lower()]

        return analysis, {"total_lines": len(filtered_logs), "error_lines": error_lines, "insert_lines": insert_lines, "warning_operations":warning_operations}
    except Exception as e:
        return {"error": str(e)}
    

def generate_html_report(start_time, end_time, logs_analysis1, logs_analysis2):
    """
    Generate an HTML report with test results and logs analysis.
    """
    duration = end_time - start_time
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    total_lines = logs_analysis2.get(("total_lines", 0))
    insert_lines = logs_analysis2.get("insert_lines", [])
    error_lines = logs_analysis2.get("error_lines", [])
    warning_operations = logs_analysis2.get("warning_operations", [])

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>MongoDB Tests Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #333; }}
            .summary, .details {{ margin-bottom: 20px; }}
            .details pre {{ background: #f4f4f4; padding: 10px; border: 1px solid #ddd; overflow-x: auto; }}
            .error {{ color: red; }}
            .slow {{ color: orange; }}
        </style>
    </head>
    <body>
        <h1>MongoDB Test Report</h1>
        <p><strong>Report Generated:</strong> {timestamp}</p>
        <div class="summary">
            <h2>Summary</h2>
            <p><strong>Test Duration:</strong> {duration} seconds</p>
            <p><strong>Total Log Lines:</strong> {total_lines}</p>
        </div>
        <div class="container">
            <table>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Insert Operations</td>
                    <td>{logs_analysis1["insert_operations"]}</td>
                </tr>
                <tr>
                    <td>Errors</td>
                    <td>{logs_analysis1["errors"]}</td>
                </tr>
                <tr>
                    <td>Warnings</td>
                    <td>{logs_analysis1["warnings"]}</td>
                </tr>
            </table>
        </div>
        <div class="details">
            
            <h2>Log Analysis</h2>
            <h3 class="error">Total Events Inserted::</h3>
            <pre>{os.linesep.join(insert_lines) if insert_lines else "Nothing was inserted."}</pre>
            
            <h3 class="error">Errors in Logs:</h3>
            <pre>{os.linesep.join(error_lines) if error_lines else "No errors found."}</pre>
            
            <h3 class="slow">Warnings:</h3>
            <pre>{os.linesep.join(warning_operations) if warning_operations else "No warnings found."}</pre>
        </div>
    </body>
    </html>
    """
    with open("tests/data-volume-tests/mongo-tests/report.html", "w") as file:
        file.write(html_content)
    

