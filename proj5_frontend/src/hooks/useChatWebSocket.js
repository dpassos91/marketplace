import { useEffect, useRef } from "react";

export default function useChatWebSocket(username, onMessageReceived) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${username}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🔌 WebSocket conectado");
    };

    socket.onmessage = (event) => {
      console.log("📨 Mensagem recebida:", event.data);
      if (onMessageReceived) {
        onMessageReceived(event.data);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Erro no WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket desligado");
    };

    return () => socket.close();
  }, [username]);

  const sendMessage = (messageObject) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(messageObject));
    }
  };

  return { sendMessage };
}
