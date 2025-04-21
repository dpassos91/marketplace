import React, { useEffect, useState, useRef } from "react";
import "./ChatWindow.css";

const ChatWindow = ({ receiverUsername, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/rest/messages/${receiverUsername}`);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    // TODO: integrar WebSocket mais tarde
    console.log(`Enviar para ${receiverUsername}: ${newMessage}`);
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
