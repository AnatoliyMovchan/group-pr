import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const StatisticsPage = () => {
  const [pageVisits, setPageVisits] = useState([]);
  const [pageClicks, setPageClicks] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("http://localhost:4000/events/statistics");
      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }
      const data = await response.json();
      console.log("Initial statistics:", data);
      setPageVisits(data.pageVisits);
      setPageClicks(data.pageClicks);
      setActiveUsers(data.activeUsers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();

    const socket = io("http://localhost:4000");

    socket.on("updateStatistics", (data) => {
      console.log("Real-time data received:", data);
      setPageVisits(data.pageVisits);
      setPageClicks(data.pageClicks);
      setActiveUsers(data.activeUsers);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const prepareBarChartData = (data, label) => {
    if (!data || data.length === 0) return null;

    const labels = data.map((item) => item._id || "Unknown");
    const counts = data.map((item) => item.count || 0);

    return {
      labels,
      datasets: [
        {
          label,
          data: counts,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareDoughnutChartData = (data) => {
    if (!data || data.length === 0) return null;

    const labels = data.map((item) => item._id || "Unknown");
    const counts = data.map((item) => item.count || 0);

    return {
      labels,
      datasets: [
        {
          label: "Active Users",
          data: counts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
        },
      ],
    };
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Statistics Dashboard</h1>
      <p className="text-muted">
        Real-time data visualization of user actions.
      </p>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h3>Page Visits</h3>
          {pageVisits.length ? (
            <Bar data={prepareBarChartData(pageVisits, "Page Visits")} />
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="col-md-6 mb-4">
          <h3>Page Clicks</h3>
          {pageClicks.length ? (
            <Bar data={prepareBarChartData(pageClicks, "Page Clicks")} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h3>Active Users</h3>
          {activeUsers.length ? (
            <Doughnut data={prepareDoughnutChartData(activeUsers)} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
