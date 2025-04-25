package aor.paj.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class SettingsEntity {

    @Id
    private int id;

    @Column(name = "session_timeout_minutes", nullable = false)
    private int sessionTimeoutMinutes;

    @Column(name = "reset_token_timeout_minutes", nullable = false)
    private int resetTokenTimeoutMinutes;

    @Column(name = "confirm_token_timeout_minutes", nullable = false)
    private int confirmTokenTimeoutMinutes;

    // Getters e setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSessionTimeoutMinutes() {
        return sessionTimeoutMinutes;
    }

    public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) {
        this.sessionTimeoutMinutes = sessionTimeoutMinutes;
    }

    public int getResetTokenTimeoutMinutes() {
        return resetTokenTimeoutMinutes;
    }

    public void setResetTokenTimeoutMinutes(int resetTokenTimeoutMinutes) {
        this.resetTokenTimeoutMinutes = resetTokenTimeoutMinutes;
    }

    public int getConfirmTokenTimeoutMinutes() {
        return confirmTokenTimeoutMinutes;
    }

    public void setConfirmTokenTimeoutMinutes(int confirmTokenTimeoutMinutes) {
        this.confirmTokenTimeoutMinutes = confirmTokenTimeoutMinutes;
    }
}

