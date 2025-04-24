import React, { useEffect, useRef, useState } from 'react';
import './NotificationBell.css';
import { notificationStore } from '../../stores/notificationStore';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);

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
      try {
        const data = JSON.parse(event.data);
        if (data.type === "mensagem") {
          addNotification({
            type: data.type,
            message: data.message,
            from: data.from,
            read: false,
          });
        }
      } catch (err) {
        console.warn("❌ Erro a processar mensagem WebSocket:", err);
      }
    };
  
    socket.onerror = (err) => {
      console.error("❌ Erro WebSocket (notificações):", err);
    };
  
    socket.onclose = () => {
      console.log("🔌 WebSocket fechado (notificações) para:", username);
    };
  
    return () => socket.close();
  }, [username, addNotification]);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  const handleClick = (senderUsername) => {
    openChatWith(senderUsername);
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
          <p>Sem notificações.</p>
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


