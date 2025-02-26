package aor.paj.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class UserDto {
    private String username;
    private String password;
    private String nome;
    private String email;
    private String telefone;
    private String imagem;
    private List<String> produtos;

    public UserDto() {
        this.produtos = new ArrayList<>();
    }

    public UserDto(String username, String password, String nome, String email,
            String telefone, String imagem, List<String> produtos) {
        this.username = username;
        this.password = password;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.imagem = imagem;
        this.produtos = (produtos != null) ? produtos : new ArrayList<>();
    }

    @XmlElement
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @XmlElement
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @XmlElement
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    @XmlElement
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @XmlElement
    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    @XmlElement
    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    @XmlElement
    public List<String> getProdutos() {
        return produtos;
    }

    public void setProdutos(List<String> produtos) {
        this.produtos = produtos;
    }
}
