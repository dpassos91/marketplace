package aor.paj.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "password_reset_token")
@NamedQueries({
    @NamedQuery(
        name = "PasswordResetToken.findByToken",
        query = "SELECT t FROM PasswordResetTokenEntity t WHERE t.token = :token"
    )
})
public class PasswordResetTokenEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "token_id")
    private UUID id;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "expiration", nullable = false)
    private LocalDateTime expiration;

    @Column(name = "used", nullable = false)
    private boolean used = false;

    // Constructors
    public PasswordResetTokenEntity() {
    }

    public PasswordResetTokenEntity(String token, UserEntity user, LocalDateTime expiration) {
        this.token = token;
        this.user = user;
        this.expiration = expiration;
        this.used = false;
    }

    // Getters and setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public LocalDateTime getExpiration() {
        return expiration;
    }

    public void setExpiration(LocalDateTime expiration) {
        this.expiration = expiration;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        PasswordResetTokenEntity that = (PasswordResetTokenEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
            return false;
        return token != null ? token.equals(that.token) : that.token == null;
    }

    // hashCode
    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (token != null ? token.hashCode() : 0);
        return result;
    }

    // toString
    @Override
    public String toString() {
        return "PasswordResetToken{" +
                "id=" + id +
                ", token='" + token + '\'' +
                ", expiration=" + expiration +
                ", used=" + used +
                '}';
    }
}



