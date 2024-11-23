import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socket = io("http://localhost:4000");

  useEffect(() => {
    console.log("WebSocket connected");

    return () => {
      socket.disconnect();
      console.log("WebSocket disconnected");
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
