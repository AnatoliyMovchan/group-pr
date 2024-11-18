import React from "react";
import useUserTracking from "../hooks/useUserTracking";

const About = () => {
  useUserTracking();
  return (
    <div>
      <h1>About</h1>
      <p>This application monitors and analyzes user behavior in real-time.</p>
    </div>
  );
};

export default About;
