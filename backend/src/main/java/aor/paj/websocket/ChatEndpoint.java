package aor.paj.websocket;

import jakarta.ejb.Singleton;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.ejb.EJB;
import aor.paj.bean.MessageBean;

import java.util.HashMap;
import java.util.Map;

@Singleton
@ServerEndpoint("/websocket/chat/{userToken}")
public class ChatEndpoint {

    @EJB
MessageBean messagebean;

    private static Map<String, Session> sessions = new HashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("userToken") String userToken) {
        System.out.println("Ligação WebSocket aberta para token: " + userToken);
        sessions.put(userToken, session);
    }

    @OnClose
    public void onClose(Session session) {
        sessions.values().remove(session);
        System.out.println("Ligação WebSocket encerrada.");
    }

    @OnMessage
public void onMessage(Session session, String messageText) {
    System.out.println("Mensagem recebida: " + messageText);

    try {
        String[] parts = messageText.split(";");
        if (parts.length < 3 || !parts[0].contains(":") || !parts[1].contains(":") || !parts[2].contains(":")) {
            System.out.println("Formato de mensagem inválido.");
            return;
        }

        String sender = parts[0].split(":")[1];
        String receiver = parts[1].split(":")[1];
        String content = parts[2].split(":")[1];

        messagebean.saveMessage(sender, receiver, content);

        Session receiverSession = sessions.get(receiver);
        if (receiverSession != null) {
            receiverSession.getBasicRemote().sendText("De " + sender + ": " + content);
        }

    } catch (Exception e) {
        System.out.println("Erro ao processar a mensagem: " + e.getMessage());
    }
}

}


