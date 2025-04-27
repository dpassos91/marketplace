package aor.paj.websocket;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.Session;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class Notifier {

    // Mapa de utilizadores ativos → sessão WebSocket
    private final Map<String, Session> activeSessions = new ConcurrentHashMap<>();

    public void add(String username, Session session) {
        activeSessions.put(username, session);
        System.out.println("📡 Ligação WebSocket registada: " + username);
    }

    public void remove(Session session) {
        activeSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
        System.out.println("❌ Ligação WebSocket removida.");
    }

    public void send(String username, String json) {
        Session session = activeSessions.get(username);
        if (session != null && session.isOpen()) {
            try {
                session.getBasicRemote().sendText(json);
                System.out.println("📨 Notificação enviada via WebSocket para: " + username);
            } catch (IOException e) {
                System.err.println("❌ Erro ao enviar notificação para " + username + ": " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ Sessão WebSocket não encontrada ou fechada para: " + username);
        }
    }

    public boolean isConnected(String username) {
        return activeSessions.containsKey(username);
    }

    public void broadcast(String json) {
        System.out.println("📣 A enviar broadcast: " + json);
        for (Session session : activeSessions.values()) {
            if (session.isOpen()) {
                try {
                    session.getBasicRemote().sendText(json);
                } catch (IOException e) {
                    System.err.println("❌ Erro ao fazer broadcast: " + e.getMessage());
                }
            }
        }
    }
}

