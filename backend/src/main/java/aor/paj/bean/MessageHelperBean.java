package aor.paj.bean;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class MessageHelperBean {

    @PersistenceContext
    EntityManager em;

    @Transactional
    public void markMessagesAsRead(String receiverUsername, String senderUsername) {
        em.createQuery("""
            UPDATE MessageEntity m
            SET m.isRead = true
            WHERE m.receiver.username = :receiver
              AND m.sender.username = :sender
              AND m.isRead = false
        """)
        .setParameter("receiver", receiverUsername)
        .setParameter("sender", senderUsername)
        .executeUpdate();
    }
}

