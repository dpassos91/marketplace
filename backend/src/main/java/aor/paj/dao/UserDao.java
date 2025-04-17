package aor.paj.dao;

import java.util.List;

import aor.paj.entity.EvaluationEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Stateless
public class UserDao {

    private static final Logger logger = LogManager.getLogger(UserDao.class);

    @PersistenceContext(unitName = "diogopassos-proj5")
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
        if (user != null && !user.isAdmin()) {
            // Este método já não será usado para soft delete
            return false;
        }
        logger.warn("Unable to delete user with id: {}", id);
        return false;
    }

    public boolean suspendUser(Long id) {
        UserEntity user = findById(id);
        if (user != null && user.isActive() && !user.isAdmin()) {
            user.setActive(false);
            entityManager.merge(user);
            return true;
        }
        logger.warn("Unable to suspend user with id: {}", id);
        return false;
    }

    public boolean activateUser(Long id) {
        UserEntity user = findById(id);
        if (user != null && !user.isActive() && !user.isAdmin()) {
            user.setActive(true);
            entityManager.merge(user);
            return true;
        }
        logger.warn("Unable to activate user with id: {}", id);
        return false;
    }

    public UserEntity findById(Long id) {
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

    public List<UserEntity> findAllDeleted() {
        return entityManager.createNamedQuery("User.findAllDeleted", UserEntity.class)
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

    public UserEntity findByIdWithAssociations(Long id) {
        return entityManager.createQuery(
            "SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.soldProducts " +
            "LEFT JOIN FETCH u.purchasedProducts " +
            "LEFT JOIN FETCH u.givenEvaluations " +
            "LEFT JOIN FETCH u.receivedEvaluations " +
            "WHERE u.id = :id", UserEntity.class)
            .setParameter("id", id)
            .getSingleResult();
    }

    public boolean permanentlyDelete(UserEntity user) {
        try {
            UserEntity managedUser = entityManager.merge(user); // Garantir que está gerido
            entityManager.remove(managedUser);
            logger.info("User with ID {} permanently deleted.", user.getId());
            return true;
        } catch (Exception e) {
            logger.error("Error deleting user permanently: {}", e.getMessage());
            return false;
        }
    }

    public void removeEvaluation(EvaluationEntity evaluation) {
        EvaluationEntity managedEvaluation = entityManager.contains(evaluation) ? evaluation : entityManager.merge(evaluation);
        entityManager.remove(managedEvaluation);
    }

    public ProductEntity mergeProduct(ProductEntity product) {
    return entityManager.merge(product);
    }


} 

