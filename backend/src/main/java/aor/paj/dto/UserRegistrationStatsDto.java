package aor.paj.dto;

public class UserRegistrationStatsDto {

    private String date;
    private int registeredUsers;

    public UserRegistrationStatsDto() {
    }

    public UserRegistrationStatsDto(String date, int registeredUsers) {
        this.date = date;
        this.registeredUsers = registeredUsers;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getRegisteredUsers() {
        return registeredUsers;
    }

    public void setRegisteredUsers(int registeredUsers) {
        this.registeredUsers = registeredUsers;
    }
}

