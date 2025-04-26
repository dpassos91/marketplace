package aor.paj.dao;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import aor.paj.entity.EvaluationEntity;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
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
        entityManager.flush();
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

    public UserEntity findByEmail(String email) {
        return entityManager.createNamedQuery("User.findByEmail", UserEntity.class)
                .setParameter("email", email)
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

    public long countAdmins() {
        return entityManager.createQuery("SELECT COUNT(u) FROM UserEntity u WHERE u.isAdmin = true", Long.class)
                 .getSingleResult();
    }    

    public long countAllUsers() {
        return entityManager.createQuery(
                "SELECT COUNT(u) FROM UserEntity u", Long.class)
                .getSingleResult();
    }

    public long countConfirmedUsers() {
        return entityManager.createQuery(
                "SELECT COUNT(u) FROM UserEntity u WHERE u.confirmed = true", Long.class)
                .getSingleResult();
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

    public UserEntity findByConfirmationToken(String token) {
    try {
        return entityManager.createNamedQuery("User.findByConfirmationToken", UserEntity.class)
                 .setParameter("token", token)
                 .getSingleResult();
    } catch (NoResultException e) {
        return null;
    }
}

public List<Object[]> countRegistrationsPerDay() {
    List<Object[]> rawResults = entityManager.createQuery(
        "SELECT FUNCTION('DATE', u.createdAt), COUNT(u) " +
        "FROM UserEntity u " +
        "GROUP BY FUNCTION('DATE', u.createdAt) " +
        "ORDER BY FUNCTION('DATE', u.createdAt)",
        Object[].class
    ).getResultList();

    List<Object[]> convertedResults = new ArrayList<>();

    for (Object[] row : rawResults) {
        java.sql.Date sqlDate = (java.sql.Date) row[0];
        LocalDate localDate = sqlDate.toLocalDate(); // 🚀 Converte corretamente
        Long count = (Long) row[1];

        convertedResults.add(new Object[]{localDate, count});
    }

    return convertedResults;
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

