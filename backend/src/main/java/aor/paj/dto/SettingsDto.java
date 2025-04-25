package aor.paj.dto;

public class SettingsDto {
    private int sessionTimeoutMinutes;
    private int resetTokenTimeoutMinutes;
    private int confirmTokenTimeoutMinutes;

    // Getters e setters

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
