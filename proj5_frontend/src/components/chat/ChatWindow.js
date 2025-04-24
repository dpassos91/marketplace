import React, { useEffect, useState, useRef } from "react";
import "./ChatWindow.css";
import { messagesAPI } from "../../api/messagesAPI";

const ChatWindow = ({ receiverUsername, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [currentUsername, setCurrentUsername] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Obter username do utilizador atual a partir do localStorage
  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      setCurrentUsername(storedData?.username);
    } catch (e) {
      console.warn("⚠️ userData inválido no localStorage", e);
    }
  }, []);

  // Marcar mensagens como lidas
  const markMessagesAsRead = async () => {
    try {
      const res = await messagesAPI.markMessagesAsReadFrom(receiverUsername);
      console.log("📘 Mensagens marcadas como lidas:", res);
    } catch (error) {
      console.error("❌ Erro ao marcar mensagens como lidas:", error);
    }
  };

  // Buscar histórico de mensagens
  useEffect(() => {
    if (!receiverUsername || !currentUsername) return;
  
    const fetchMessages = async () => {
      try {
        const data = await messagesAPI.getConversationWith(receiverUsername);
        console.log("📥 Dados recebidos no fetch:", data);
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      } finally {
        setLoading(false);
        markMessagesAsRead();
      }
    };
  
    fetchMessages();
  }, [receiverUsername, currentUsername]); // ✅ agora espera pelos dois
  

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket (apenas quando currentUsername estiver disponível)
  useEffect(() => {
    if (!currentUsername || !receiverUsername) return;

    console.log("🧪 Tentativa de abrir WebSocket com:", currentUsername, receiverUsername);

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${currentUsername}`);
    socketRef.current = socket;

    socket.onopen = () => console.log("✅ WebSocket ligado");

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "mensagem") {
          console.log("🔔 Notificação WebSocket:", parsed.message);
          return;
        }

        if (parsed.content && parsed.sender) {
          setMessages((prev) => [...prev, {
            content: parsed.content,
            sender: parsed.sender
          }]);
          return;
        }

        console.warn("📦 Mensagem WebSocket desconhecida:", parsed);
      } catch (e) {
        const content = event.data;
        if (!content.startsWith("✔️") && !content.startsWith("❌")) {
          console.log("📨 Mensagem direta recebida:", content);
          setMessages((prev) => [...prev, {
            content,
            sender: receiverUsername
          }]);
        }
      }
    };

    socket.onerror = (error) => console.error("❌ Erro no WebSocket:", error);
    socket.onclose = () => console.log("🔌 WebSocket desligado");

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
        console.log("📡 Ping enviado");
      }
    }, 60000);

    return () => {
      socket.close();
      clearInterval(pingInterval);
    };
  }, [currentUsername, receiverUsername]);

  // Enviar mensagem
  const handleSend = () => {
    if (newMessage.trim() === "" || !currentUsername) return;

    const messageObject = {
      sender: currentUsername,
      receiver: receiverUsername,
      content: newMessage.trim()
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify(messageObject);
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
    messages.map((msg, i) => {
      const isSender = msg.sender === currentUsername;
      return (
        <div key={i} className={`chat-message ${isSender ? "sent" : "received"}`}>
          {!isSender && (
            <div className="message-meta">
              <div className="user-icon">
                <i className="fa fa-user-circle" aria-hidden="true"></i>
              </div>
              <span>@{msg.sender}</span>
            </div>
          )}
          <div className="bubble">{msg.content}</div>
        </div>
      );
    })
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


