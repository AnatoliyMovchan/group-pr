import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useUserTracking = () => {
  const location = useLocation();

  const sendEvent = (eventType, data) => {
    const event = {
      sessionId: localStorage.getItem("sessionId") || generateSessionId(),
      userId: localStorage.getItem("userId") || "",
      page: window.location.pathname,
      actionType: eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:4000/events/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch((error) => console.error("Error sending event:", error));
  };

  const generateSessionId = () => {
    const sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
    return sessionId;
  };

  useEffect(() => {
    sendEvent("visit", { page: location.pathname });
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      sendEvent("click", { x: e.clientX, y: e.clientY });
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [location]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     sendEvent("scroll", { scrollTop: window.scrollY });
  //   };
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [location]);
};

export default useUserTracking;
