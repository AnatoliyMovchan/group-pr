import React from "react";
import Dashboard from "../components/Dashboard";

const HomePage = () => {
  return (
    <div>
      <h1 className="mt-4">Welcome to the User Monitoring System</h1>
      <p className="text-muted">
        Monitor and analyze user behavior in real-time to enhance your website's
        experience.
      </p>
      <Dashboard />
    </div>
  );
};

export default HomePage;
