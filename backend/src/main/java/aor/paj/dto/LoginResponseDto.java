package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class LoginResponseDto {
    private String id;
    private String token;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String id, String token) {
        this.id = id;
        this.token = token;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    @XmlElement
    public String getToken() {
        return token;
    }

    public void setId(String id) {}

    public void setToken(String token) {}
}