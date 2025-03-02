package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class LoginResponseDto {
    private Long id;
    private String token;

    public LoginResponseDto() {
    }

    public LoginResponseDto(Long id, String token) {
        this.id = id;
        this.token = token;
    }

    @XmlElement
    public Long getId() {
        return id;
    }

    @XmlElement
    public String getToken() {
        return token;
    }

    public void setId(Long id) {this.id = id;}

    public void setToken(String token) {this.token = token;}
}