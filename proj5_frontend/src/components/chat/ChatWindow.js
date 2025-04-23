import React, { useEffect, useState, useRef } from "react";
import "./ChatWindow.css";
import { messagesAPI } from "../../api/messagesAPI"; 

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
    const fetchMessages = async () => {
      try {
        const data = await messagesAPI.getConversationWith(receiverUsername);
        console.log("📥 Dados recebidos no fetch:", data);
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      } finally {
        setLoading(false);
        markMessagesAsRead(); // 👈 chamada após carregar
      }
    };

    fetchMessages();
  }, [receiverUsername]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket
  useEffect(() => {
    if (!currentUsername.current || !receiverUsername) return;

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${currentUsername.current}`);
    socketRef.current = socket;

    socket.onopen = () => console.log("✅ WebSocket ligado");
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
    
        if (parsed.type === "mensagem") {
          // É uma notificação, não uma mensagem direta
          console.log("🔔 Notificação WebSocket:", parsed.message);
          return;
        }
    
        if (parsed.content && parsed.sender) {
          // Mensagem de chat com formato estruturado (opcional se implementares isso no futuro)
          setMessages((prev) => [...prev, {
            content: parsed.content,
            sender: parsed.sender
          }]);
          return;
        }
    
        // Se for um objeto inesperado, só mostra no log
        console.warn("📦 Mensagem WebSocket desconhecida:", parsed);
      } catch (e) {
        // Se não for JSON (ou seja, texto plano), trata como mensagem direta
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

      // 🕐 Ping de 60s para manter ligação ativa
  const pingInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("ping");
      console.log("📡 Ping enviado");
    }
  }, 60000); // 60 segundos

    return () => { 
      socket.close();
    clearInterval(pingInterval);
    };
  }, [receiverUsername]);

  // Enviar mensagem
  const handleSend = () => {
    const sender = currentUsername.current;

    if (newMessage.trim() === "") return;

    const messageObject = {
      sender,
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
          messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender === currentUsername.current ? "sent" : "received"}`}>
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

