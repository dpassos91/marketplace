package aor.paj.bean;

import aor.paj.entity.MessageEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDateTime;
import java.util.List;

@Stateless
public class MessageBean {

    @PersistenceContext
    EntityManager em;

    public void saveMessage(String sender, String receiver, String content) {
        MessageEntity msg = new MessageEntity();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setIsRead(false);
        em.persist(msg);
    }

    public List<MessageEntity> getConversation(String user1, String user2) {
        return em.createQuery("""
                SELECT m FROM MessageEntity m
                WHERE (m.sender = :u1 AND m.receiver = :u2)
                   OR (m.sender = :u2 AND m.receiver = :u1)
                ORDER BY m.timestamp
            """, MessageEntity.class)
            .setParameter("u1", user1)
            .setParameter("u2", user2)
            .getResultList();
    }
}

