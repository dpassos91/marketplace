package aor.paj.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "user")
public class UserEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // gera o ID automaticamente
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, updatable = false)
    private String username;

    @Column(name = "first_name", nullable = false, unique = false, updatable = true)
    private String firstName;

    @Column(name="last_name", nullable = false, unique = false, updatable = true)
    private String lastName;

    @Column(name="password", nullable = false, unique = false, updatable = true)
    private String password;

    @Column(name="token", nullable = true, unique = true, updatable = true)
    private String token;

    @Column(name="email", nullable = false, unique = false, updatable = true)
    private String email;

    @Column(name="phone", nullable = false, unique = false, updatable = true)
    private String phone;

    @Column(name="is_active", nullable = false, unique = false, updatable = true)
    private boolean isActive;

    @Column(name="is_admin", nullable = false, unique = false, updatable = true)
    private boolean isAdmin;

    @OneToMany(mappedBy = "seller")
    private Set<ProductEntity> products;

    @OneToMany(mappedBy = "buyer")
    private Set<ProductEntity> products;

    @OneToMany(mappedBy = "seller")
    private Set<EvaluationEntity> evaluations;

    @OneToMany(mappedBy = "buyer")
    private Set<EvaluationEntity> evaluations;

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPassword() {
        return password;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public boolean isActive() {
        return isActive;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}
