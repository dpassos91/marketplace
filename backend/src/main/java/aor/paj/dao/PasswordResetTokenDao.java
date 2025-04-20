package aor.paj.dao;

import aor.paj.entity.PasswordResetTokenEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Stateless
public class PasswordResetTokenDao {

    private static final Logger logger = LogManager.getLogger(PasswordResetTokenDao.class);

    @PersistenceContext(unitName = "diogopassos-proj5")
    private EntityManager entityManager;

    public PasswordResetTokenEntity create(PasswordResetTokenEntity token) {
        entityManager.persist(token);
        entityManager.flush();
        return token;
    }

    public PasswordResetTokenEntity update(PasswordResetTokenEntity token) {
        return entityManager.merge(token);
    }

    public Optional<PasswordResetTokenEntity> findByToken(String tokenValue) {
        return entityManager
            .createNamedQuery("PasswordResetToken.findByToken", PasswordResetTokenEntity.class)
            .setParameter("token", tokenValue)
            .getResultStream()
            .findFirst();
    }
}

