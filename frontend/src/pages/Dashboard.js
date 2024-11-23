import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/analytics/events-summary")
      .then((res) => res.json())
      .then((data) => {
        setChartData({
          labels: data.map((item) => item._id),
          datasets: [
            {
              label: "Events",
              data: data.map((item) => item.count),
              borderColor: "rgba(75,192,192,1)",
              fill: false,
            },
          ],
        });
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Line data={chartData} />
    </div>
  );
};

export default Dashboard;
