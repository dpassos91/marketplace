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
    if (!username) return;

    const socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${username}`);
    socketRef.current = socket;

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
      } catch {
        // Ignora mensagens não estruturadas
      }
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
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
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


