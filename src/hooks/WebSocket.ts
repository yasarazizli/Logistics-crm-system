import { useEffect, useRef, useState } from "react";

export type NotificationMessage = {
  message: string;
  sender_name: string;
  sender_role: string;
  date: string;
  read: boolean;
};

export const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    console.log("WS connecting:", url);
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log("WS connected");
      setConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      console.log("📩 WS raw:", event.data);

      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WS error:", err);
    };

    socketRef.current.onclose = () => {
      console.log("WS closed");
      setConnected(false);
    };

    return () => {
      console.log("WS cleanup");
      socketRef.current?.close();
    };
  }, [url]);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return {
    messages,
    unreadCount,
    markAllAsRead,
    connected,
  };
};
