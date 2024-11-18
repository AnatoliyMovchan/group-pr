import React from "react";
import useUserTracking from "../hooks/useUserTracking";

const Contact = () => {
  useUserTracking();
  return (
    <div>
      <h1>Contact</h1>
      <p>Email: support@usermonitoring.com</p>
      <p>Phone: +123456789</p>
    </div>
  );
};

export default Contact;
