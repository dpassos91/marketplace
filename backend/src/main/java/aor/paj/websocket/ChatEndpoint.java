package aor.paj.websocket;

import aor.paj.bean.MessageBean;
import aor.paj.bean.NotificationBean;
import aor.paj.dto.MessageDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.ejb.Singleton;

import java.util.HashMap;
import java.util.Map;

@Singleton
@ServerEndpoint("/websocket/chat/{userToken}")
public class ChatEndpoint {

    @Inject
    MessageBean messagebean;

    @Inject
    NotificationBean notificationBean;

    @Inject
    Notifier notifier;

    private static final Map<String, Session> sessions = new HashMap<>();
    private static final ObjectMapper mapper = new ObjectMapper();

    @OnOpen
    public void onOpen(Session session, @PathParam("userToken") String userToken) {
        System.out.println("🟢 Ligação WebSocket aberta para: " + userToken);
        sessions.put(userToken, session);
        notifier.add(userToken, session);
    }

    @OnClose
    public void onClose(Session session) {
        notifier.remove(session);
        sessions.values().remove(session);
        System.out.println("🔴 Ligação WebSocket encerrada.");
    }

    @OnMessage
    public void onMessage(Session session, String messageText) {
        System.out.println("📥 MENSAGEM RECEBIDA: " + messageText);

        try {
            MessageDto dto = mapper.readValue(messageText, MessageDto.class);

            String sender = dto.getSender();
            String receiver = dto.getReceiver();
            String content = dto.getContent();

            if (sender == null || receiver == null || content == null ||
                sender.isBlank() || receiver.isBlank() || content.isBlank()) {
                System.out.println("⚠️ Mensagem inválida.");
                session.getBasicRemote().sendText("❌ Mensagem inválida: campos obrigatórios.");
                return;
            }

            // Gravar mensagem na BD
            messagebean.saveMessage(sender, receiver, content);

            // Enviar mensagem diretamente ao destinatário se estiver online
            Session receiverSession = sessions.get(receiver);
            if (receiverSession != null && receiverSession.isOpen()) {
                receiverSession.getBasicRemote().sendText("De " + sender + ": " + content);
            }

            // Criar notificação na BD
            String textoNotificacao = "Nova mensagem de " + sender;
            notificationBean.createNotification(receiver, "mensagem", textoNotificacao);

            // Enviar notificação ao destinatário se estiver online
            String jsonNotificacao = mapper.writeValueAsString(Map.of(
                "type", "mensagem",
                "message", textoNotificacao,
                "from", sender
            ));
            notifier.send(receiver, jsonNotificacao);

            // Confirmar envio ao remetente
            session.getBasicRemote().sendText("✔️ Mensagem enviada para " + receiver + ": " + content);

        } catch (Exception e) {
            System.out.println("❌ Erro ao processar mensagem: " + e.getMessage());
            try {
                session.getBasicRemote().sendText("❌ Erro ao processar a mensagem.");
            } catch (Exception ignored) {}
        }
    }
}



