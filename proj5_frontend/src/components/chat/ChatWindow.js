import React, { useEffect, useState, useRef } from "react";
import "./ChatWindow.css";

const ChatWindow = ({ receiverUsername, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const currentUsername = useRef(null);
  try {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    currentUsername.current = storedData?.username;
  } catch (e) {
    console.warn("⚠️ userData inválido no localStorage", e);
  }

  // Fetch histórico de mensagens
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/rest/messages/${receiverUsername}`, {
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("authToken"),
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiverUsername]);

  // Scroll automático para o fim
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Conexão WebSocket
  useEffect(() => {
    if (!currentUsername.current) return;

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${currentUsername.current}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket ligado");
    };

    socket.onmessage = (event) => {
      const content = event.data;
      console.log("📨 Nova mensagem via WebSocket:", content);

      // Evita re-renderizações por mensagens de confirmação ou erro
      if (!content.startsWith("✔️") && !content.startsWith("❌")) {
        setMessages((prev) => [...prev, {
          content,
          sender: receiverUsername // assumimos que a mensagem veio do outro
        }]);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ Erro no WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket desligado");
    };

    return () => {
      socket.close();
    };
  }, [receiverUsername]);

  const handleSend = () => {
    const sender = currentUsername.current;

    console.log("👤 Utilizador atual:", sender);
    console.log("🎯 Destinatário da mensagem:", receiverUsername);

    if (newMessage.trim() === "") return;

    const messageObject = {
      sender,
      receiver: receiverUsername,
      content: newMessage.trim()
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify(messageObject);
      console.log("📤 A enviar mensagem via WebSocket:", msg);
      socketRef.current.send(msg);
      setMessages((prev) => [...prev, messageObject]);
    } else {
      console.warn("❌ WebSocket não está ligado.");
    }

    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>Conversa com @{receiverUsername}</span>
        <button className="chat-close-button" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <p>A carregar...</p>
        ) : messages.length === 0 ? (
          <p>Sem mensagens.</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender === receiverUsername ? "received" : "sent"}`}>
              <div className="bubble">{msg.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Escreva uma mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatWindow;

