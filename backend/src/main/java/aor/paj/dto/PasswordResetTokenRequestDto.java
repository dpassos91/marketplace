package aor.paj.dto;

public class PasswordResetTokenRequestDto {

    private String email;

    public PasswordResetTokenRequestDto() {
    }

    public PasswordResetTokenRequestDto(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

