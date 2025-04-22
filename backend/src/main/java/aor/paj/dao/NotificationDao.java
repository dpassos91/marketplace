package aor.paj.dao;

import aor.paj.entity.NotificationEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class NotificationDao {

    @PersistenceContext
    EntityManager em;

    public void persist(NotificationEntity notification) {
        em.persist(notification);
    }

    public List<NotificationEntity> findByUser(UserEntity user) {
        return em.createQuery("SELECT n FROM NotificationEntity n WHERE n.user = :user ORDER BY n.createdAt DESC", NotificationEntity.class)
                .setParameter("user", user)
                .getResultList();
    }

    public List<NotificationEntity> findUnreadByUser(UserEntity user) {
        return em.createQuery("SELECT n FROM NotificationEntity n WHERE n.user = :user AND n.isRead = false ORDER BY n.createdAt DESC", NotificationEntity.class)
                .setParameter("user", user)
                .getResultList();
    }

    public void markAllAsRead(UserEntity user) {
        em.createQuery("UPDATE NotificationEntity n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
                .setParameter("user", user)
                .executeUpdate();
    }
}
