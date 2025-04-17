package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class LoginResponseDto {
    private Long userId;
    private String token;

    public LoginResponseDto() {
    }

    public LoginResponseDto(Long userId, String token) {
        this.userId = userId;
        this.token = token;
    }

    @XmlElement
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @XmlElement
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
