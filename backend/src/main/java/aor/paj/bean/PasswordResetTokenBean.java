package aor.paj.bean;

import aor.paj.dao.PasswordResetTokenDao;
import aor.paj.dao.UserDao;
import aor.paj.entity.PasswordResetTokenEntity;
import aor.paj.entity.UserEntity;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class PasswordResetTokenBean {

    private static final Logger logger = LogManager.getLogger(PasswordResetTokenBean.class);

    @Inject
    PasswordResetTokenDao passwordResetTokenDao;

    @Inject
    UserDao userDao;

    /**
     * Gera um token único de recuperação de password para o email fornecido.
     *
     * @param email do utilizador
     * @return token gerado
     */
    
     public String generateResetToken(String email) {
        UserEntity user = userDao.findByEmail(email);
        if (user == null) {
            logger.warn("Pedido de reset rejeitado — utilizador com email '{}' não encontrado", email);
            throw new IllegalArgumentException("Email não registado no sistema.");
        }
    
        String tokenString = UUID.randomUUID().toString();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(15);
    
        PasswordResetTokenEntity token = new PasswordResetTokenEntity(tokenString, user, expiration);
        passwordResetTokenDao.create(token);
    
        logger.info("Token de recuperação gerado para utilizador '{}'", user.getUsername());
        return tokenString;
    }

    /**
     * Revalida o token e redefine a password do utilizador.
     *
     * @param tokenString o token enviado
     * @param newPassword a nova password
     */
    public void resetPassword(String tokenString, String newPassword) {
        PasswordResetTokenEntity token = passwordResetTokenDao.findByToken(tokenString)
            .orElseThrow(() -> new IllegalStateException("O token fornecido é inválido ou não existe."));

        if (token.isUsed()) {
            throw new IllegalStateException("Este token já foi utilizado. Solicita um novo pedido de recuperação.");
        }

        if (token.getExpiration().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("O token expirou. Solicita um novo pedido de recuperação.");
        }

        UserEntity user = token.getUser();
        if (user == null) {
            throw new IllegalStateException("O utilizador associado ao token não foi encontrado.");
        }

        user.setPassword(newPassword); // Aplica hashing se necessário aqui
        token.setUsed(true);

        userDao.update(user);
        passwordResetTokenDao.update(token);

        logger.info("Password redefinida com sucesso para utilizador '{}'", user.getUsername());
    }
}

