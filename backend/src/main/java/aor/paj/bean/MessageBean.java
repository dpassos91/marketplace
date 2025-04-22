package aor.paj.bean;

import aor.paj.entity.MessageEntity;
import aor.paj.entity.UserEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class MessageBean {

    @PersistenceContext
    EntityManager em;

    public void saveMessage(String senderUsername, String receiverUsername, String content) {
        UserEntity sender = em.createQuery(
            "SELECT u FROM UserEntity u WHERE u.username = :username", UserEntity.class)
            .setParameter("username", senderUsername)
            .getSingleResult();
    
        UserEntity receiver = em.createQuery(
            "SELECT u FROM UserEntity u WHERE u.username = :username", UserEntity.class)
            .setParameter("username", receiverUsername)
            .getSingleResult();
    
        MessageEntity msg = new MessageEntity();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setIsRead(false);
        em.persist(msg);
    }
    


public List<MessageEntity> getConversation(String username1, String username2) {
    return em.createQuery("""
            SELECT m FROM MessageEntity m
            WHERE (m.sender.username = :u1 AND m.receiver.username = :u2)
               OR (m.sender.username = :u2 AND m.receiver.username = :u1)
            ORDER BY m.timestamp
        """, MessageEntity.class)
        .setParameter("u1", username1)
        .setParameter("u2", username2)
        .getResultList();
}
}

