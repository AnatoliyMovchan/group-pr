import React from "react";
import { Line } from "react-chartjs-2";

const Chart = ({ events }) => {
  const data = {
    labels: events.map((e) => new Date(e.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Events",
        data: events.map((e, index) => index),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default Chart;
