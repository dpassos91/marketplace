import React, { useEffect, useState, useRef } from "react";
import "./ChatWindow.css";
import { messagesAPI } from "../../api/messagesAPI";
import { useIntl } from "react-intl";

const ChatWindow = ({ receiverUsername, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [currentUsername, setCurrentUsername] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const intl = useIntl();

  // Obter username do utilizador atual a partir do localStorage
  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      setCurrentUsername(storedData?.username);
    } catch (e) {
      console.warn(intl.formatMessage({
        id: "chat.warn.invalidUserData",
        defaultMessage: "Dados de utilizador inválidos no localStorage."
      }), e);
    }
  }, []);

  // Buscar histórico de mensagens
  useEffect(() => {
    if (!receiverUsername || !currentUsername) return;

    const fetchMessages = async () => {
      try {
        const data = await messagesAPI.getConversationWith(receiverUsername);
        console.log("📥", intl.formatMessage({
          id: "chat.log.fetchMessages",
          defaultMessage: "Dados recebidos no fetch:"
        }), data);
        setMessages(data);
      } catch (error) {
        console.error("❌", intl.formatMessage({
          id: "chat.error.fetchMessages",
          defaultMessage: "Erro ao carregar mensagens."
        }), error);
      } finally {
        setLoading(false);
        markMessagesAsRead();
      }
    };

    fetchMessages();
  }, [receiverUsername, currentUsername]);

  // Marcar mensagens como lidas
  const markMessagesAsRead = async () => {
    try {
      const res = await messagesAPI.markMessagesAsReadFrom(receiverUsername);
      console.log("📘", intl.formatMessage({
        id: "chat.log.markAsRead",
        defaultMessage: "Mensagens marcadas como lidas."
      }), res);
    } catch (error) {
      console.error("❌", intl.formatMessage({
        id: "chat.error.markAsRead",
        defaultMessage: "Erro ao marcar mensagens como lidas."
      }), error);
    }
  };

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket para receber mensagens em tempo real
  useEffect(() => {
    if (!currentUsername || !receiverUsername) return;

    console.log("🧪", intl.formatMessage({
      id: "chat.log.openingWebSocket",
      defaultMessage: "Tentativa de abrir WebSocket com:"
    }), currentUsername, receiverUsername);

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${currentUsername}`);
    socketRef.current = socket;

    socket.onopen = () => console.log("✅", intl.formatMessage({
      id: "chat.log.websocketOpened",
      defaultMessage: "WebSocket ligado"
    }));

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "mensagem") {
          console.log("🔔", intl.formatMessage({
            id: "chat.log.websocketNotification",
            defaultMessage: "Notificação WebSocket:"
          }), parsed.message);
          return;
        }

        if (parsed.content && parsed.sender) {
          setMessages((prev) => [...prev, {
            content: parsed.content,
            sender: parsed.sender
          }]);
          return;
        }

        console.warn("📦", intl.formatMessage({
          id: "chat.warn.unknownMessage",
          defaultMessage: "Mensagem WebSocket desconhecida:"
        }), parsed);
      } catch (e) {
        const content = event.data;
        if (!content.startsWith("✔️") && !content.startsWith("❌")) {
          console.log("📨", intl.formatMessage({
            id: "chat.log.directMessage",
            defaultMessage: "Mensagem direta recebida:"
          }), content);
          setMessages((prev) => [...prev, {
            content,
            sender: receiverUsername
          }]);
        }
      }
    };

    socket.onerror = (error) => console.error("❌", intl.formatMessage({
      id: "chat.error.websocket",
      defaultMessage: "Erro no WebSocket:"
    }), error);

    socket.onclose = () => {
      console.log("🔌", intl.formatMessage({
        id: "chat.log.websocketClosed",
        defaultMessage: "WebSocket desligado"
      }));
    
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('Sessão expirada. Por favor faça login novamente.');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    };

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
        console.log("📡", intl.formatMessage({
          id: "chat.log.pingSent",
          defaultMessage: "Ping enviado"
        }));
      }
    }, 60000);

    return () => {
      socket.close();
      clearInterval(pingInterval);
    };
  }, [currentUsername, receiverUsername]);

  // Enviar nova mensagem
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
      console.warn(intl.formatMessage({
        id: "chat.warn.websocketNotConnected",
        defaultMessage: "O WebSocket não está ligado."
      }));
    }

    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>
          {intl.formatMessage(
            { id: "chat.withUser", defaultMessage: "Conversa com @{username}" },
            { username: receiverUsername }
          )}
        </span>
        <button className="chat-close-button" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <p>{intl.formatMessage({ id: "chat.loading", defaultMessage: "A carregar..." })}</p>
        ) : messages.length === 0 ? (
          <p>{intl.formatMessage({ id: "chat.noMessages", defaultMessage: "Sem mensagens." })}</p>
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
          placeholder={intl.formatMessage({ id: "chat.placeholder", defaultMessage: "Escreva uma mensagem..." })}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          {intl.formatMessage({ id: "chat.send", defaultMessage: "Enviar" })}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;



