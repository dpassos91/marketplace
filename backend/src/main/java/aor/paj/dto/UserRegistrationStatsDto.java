package aor.paj.dto;

import java.time.LocalDate;

public class UserRegistrationStatsDto {

    private LocalDate date; 
    private int registeredUsers;

    public UserRegistrationStatsDto() {
    }

    public UserRegistrationStatsDto(LocalDate date, int registeredUsers) {
        this.date = date;
        this.registeredUsers = registeredUsers;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getRegisteredUsers() {
        return registeredUsers;
    }

    public void setRegisteredUsers(int registeredUsers) {
        this.registeredUsers = registeredUsers;
    }
}

