package aor.paj.bean;

import aor.paj.dao.NotificationDao;
import aor.paj.dao.UserDao;
import aor.paj.entity.NotificationEntity;
import aor.paj.entity.UserEntity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class NotificationBean {

    @Inject
    NotificationDao notificationDao;

    @Inject
    UserDao userDao;

    public void createNotification(String username, String type, String message) {
        UserEntity user = userDao.findByUsername(username);
        if (user != null) {
            NotificationEntity notification = new NotificationEntity();
            notification.setUser(user);
            notification.setType(type);
            notification.setMessage(message);
            notificationDao.persist(notification);
        }
    }

    public List<NotificationEntity> getUserNotifications(String username) {
        UserEntity user = userDao.findByUsername(username);
        return user != null ? notificationDao.findByUser(user) : List.of();
    }

    public List<NotificationEntity> getUnreadNotifications(String username) {
        UserEntity user = userDao.findByUsername(username);
        return user != null ? notificationDao.findUnreadByUser(user) : List.of();
    }

    public void markAllAsRead(String username) {
        UserEntity user = userDao.findByUsername(username);
        if (user != null) {
            notificationDao.markAllAsRead(user);
        }
    }
}

