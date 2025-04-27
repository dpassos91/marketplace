import React, { useEffect, useRef, useState } from 'react';
import './NotificationBell.css';
import { notificationStore } from '../../stores/notificationStore'; 
import { useIntl } from 'react-intl'; 

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);
  const intl = useIntl(); 

  const notifications = notificationStore((state) => state.notifications);
  const unreadCount = notificationStore((state) => state.unreadCount);
  const addNotification = notificationStore((state) => state.addNotification);
  const markAllAsRead = notificationStore((state) => state.markAllAsRead);
  const openChatWith = notificationStore((state) => state.openChatWith);

  const username = JSON.parse(localStorage.getItem("userData"))?.username;

  useEffect(() => {
    if (!username) {
      console.warn("⚠️ NotificationBell: username não encontrado, WebSocket não será iniciado.");
      return;
    }

    console.log("🔄 NotificationBell montado para:", username);

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${username}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket ligado (notificações) para:", username);
    };

    socket.onmessage = (event) => {
      console.log("📥 Mensagem recebida via WebSocket (bruta):", event.data);

      try {
        const data = JSON.parse(event.data);
    
        switch (data.type) {
          case "chat_message":
            console.log("📩 Nova mensagem de chat recebida:", data);
            break;
    
            case "mensagem":
              addNotification({
                id: Date.now(), // <- adicionar id aqui também!
                type: "mensagem",
                message: data.message,
                from: data.from,
                read: false,
              });
              break;
    
            case "productCreated":
              addNotification({
                id: Date.now(), // <- Gerar ID único no frontend
                type: "productCreated",
                message: intl.formatMessage({ id: "notifications.productCreated", defaultMessage: "Novo produto adicionado!" }),
                read: false,
              });
              break;
    
          case "productUpdated":
            addNotification({
              id: Date.now(), // <- Gerar ID único no frontend
              type: "productUpdated",
              message: intl.formatMessage({ id: "notifications.productUpdated", defaultMessage: "Produto atualizado!" }),
              read: false,
            });
            break;
    
          case "userCreated":
            addNotification({
              id: Date.now(), // <- Gerar ID único no frontend
              type: "userCreated",
              message: intl.formatMessage({ id: "notifications.userCreated", defaultMessage: "Novo utilizador registado!" }),
              read: false,
            });
            break;
    
          default:
            console.warn("❓ Tipo de mensagem WebSocket desconhecido:", data.type);
        }
      } catch (err) {
        console.warn("❌ Erro a processar mensagem WebSocket:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ Erro WebSocket (notificações):", err);
    };

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

    return () => socket.close();
  }, [username, addNotification, intl]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const handleClick = (senderUsername) => {
    if (senderUsername) {
      openChatWith(senderUsername);
    }
    setIsOpen(false);
  };

  return (
    <div className="notification-bell">
      <button className="bell-icon" onClick={toggleDropdown}>
        <span className="icon-wrapper">
          <i className="fa fa-bell"></i>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </span>
      </button>
      <div className={`notification-dropdown ${isOpen ? "open" : ""}`}>
        {notifications.length === 0 ? (
          <p>{intl.formatMessage({ id: "notifications.none", defaultMessage: "Sem notificações" })}</p>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className="notification-item" onClick={() => handleClick(n.from)}>
              {n.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationBell;



