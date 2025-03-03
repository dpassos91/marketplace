package aor.paj.dao;

import java.util.List;

import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Stateless
public class UserDao {

    @PersistenceContext(unitName = "jorge-nuno-diogo-proj3")
    private EntityManager entityManager;

    public UserEntity create(UserEntity user) {
        entityManager.persist(user);
        return user;
    }

    public UserEntity update(UserEntity user) {
        return entityManager.merge(user);
    }

    public boolean delete(Long id) {
        UserEntity user = findById(id);
        if (user != null) {
            entityManager.remove(user);
            return true;
        }
        return false;
    }

    public boolean suspendUser(Long id) {
        UserEntity user = findById(id);
        if (user != null) {
            user.setActive(false);
            return true;
        }
        return false;
    }

    public UserEntity findById(Long id){
        return entityManager.createNamedQuery("User.findById", UserEntity.class)
                .setParameter("id", id)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    public List<UserEntity> findAll() {
        return entityManager.createNamedQuery("User.findAll", UserEntity.class)
                .getResultList();
    }

    public List<UserEntity> findAllActive() {
        return entityManager.createNamedQuery("User.findByActive", UserEntity.class)
                .setParameter("isActive", true)
                .getResultList();
    }

    public List<String> findAllUsername() {
        return entityManager.createNamedQuery("User.findAllUsername", String.class).getResultList();
    }

    public UserEntity findByUsername(String username) {
        return entityManager.createNamedQuery("User.findByUsername", UserEntity.class)
                .setParameter("username", username)
                .getResultStream()
                .findFirst().orElse(null);
    }

    public UserEntity findByToken(String token) {
        return entityManager.createNamedQuery("User.findByToken", UserEntity.class)
                .setParameter("token", token)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }


}
