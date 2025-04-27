let socket = null;

export const connectGlobalWebSocket = (username, onMessageReceived) => {
  if (!username) {
    console.error("Username inválido para WebSocket global");
    return;
  }

  socket = new WebSocket(`ws://localhost:8080/diogopassos-proj5/websocket/chat/${username}`);

  socket.onopen = () => {
    console.log("🌐 Global WebSocket ligado para:", username);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🌍 Nova mensagem recebida:", data);
      if (onMessageReceived) {
        onMessageReceived(data);
      }
    } catch (error) {
      console.error("Erro ao ler mensagem WebSocket global:", error);
    }
  };

  socket.onerror = (error) => {
    console.error("❌ Erro WebSocket Global:", error);
  };

  socket.onclose = () => {
    console.log("🔌 Global WebSocket desligado");
  };
};

export const disconnectGlobalWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
