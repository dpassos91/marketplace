package aor.paj.entity;

import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

import org.mindrot.jbcrypt.BCrypt;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "app_user")
@NamedQueries({
        @NamedQuery(name = "User.findAll", query = "SELECT user FROM UserEntity user"),
        @NamedQuery(
    name = "User.findById",
    query = "SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.soldProducts " +
            "LEFT JOIN FETCH u.purchasedProducts " +
            "LEFT JOIN FETCH u.givenEvaluations " +
            "LEFT JOIN FETCH u.receivedEvaluations " +
            "WHERE u.id = :id"
),
        @NamedQuery(name = "User.findByActive", query = "SELECT user FROM UserEntity user WHERE user.isActive = :isActive"),
        @NamedQuery(name = "User.findAllDeleted", query = "SELECT user FROM UserEntity user WHERE user.isActive = false AND user.username = 'Criador Excluído'"),
        @NamedQuery(name = "User.findAllUsername", query = "SELECT user.username FROM UserEntity user"),
        @NamedQuery(name = "User.findByUsername", query = "SELECT user FROM UserEntity user WHERE user.username = :username"),
        @NamedQuery(name = "User.findByToken", query = "SELECT user FROM UserEntity user WHERE user.token = :token")
})
public class UserEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, updatable = false)
    private String username;

    @Column(name = "first_name", nullable = false, updatable = true)
    private String firstName;

    @Column(name = "last_name", nullable = false, updatable = true)
    private String lastName;

    @Column(name = "password", nullable = false, updatable = true)
    private String password;

    @Column(name = "token", unique = true, updatable = true)
    private String token;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true, updatable = true)
    private String email;

    @NotBlank
    @Column(name = "phone", nullable = false, updatable = true)
    private String phone;

    @Column(name = "picture", nullable = false, updatable = true)
    private String picture;

    @Column(name = "is_active", nullable = false, updatable = true)
    private boolean isActive;

    @Column(name = "is_admin", nullable = false, updatable = true)
    private boolean isAdmin;

    @OneToMany(mappedBy = "seller")
    private Set<ProductEntity> soldProducts;

    @OneToMany(mappedBy = "buyer")
    private Set<ProductEntity> purchasedProducts;

    @OneToMany(mappedBy = "evaluator", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EvaluationEntity> givenEvaluations;

    @OneToMany(mappedBy = "evaluated", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EvaluationEntity> receivedEvaluations;

    public UserEntity() {
    }

    public UserEntity(String username, String firstName, String lastName, String password, String token,
                      String email, String phone, String picture, boolean isActive, boolean isAdmin) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password != null && !password.startsWith("$2a$") ? BCrypt.hashpw(password, BCrypt.gensalt(12)) : password;
        this.token = token;
        this.email = email;
        this.phone = phone;
        this.picture = picture;
        this.isActive = isActive;
        this.isAdmin = isAdmin;
    }

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

    public String getPicture() {
        return picture;
    }

    public boolean isActive() {
        return isActive;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        if (password != null && !password.startsWith("$2a$")) {
            this.password = BCrypt.hashpw(password, BCrypt.gensalt(12));
        } else {
            this.password = password;
        }
    }

    public boolean checkPassword(String plainPassword) {
        return BCrypt.checkpw(plainPassword, this.password);
    }

    public boolean updatePassword(String currentPassword, String newPassword) {
        if (checkPassword(currentPassword)) {
            setPassword(newPassword);
            return true;
        }
        return false;
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

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Set<ProductEntity> getSoldProducts() {
        return soldProducts;
    }

    public void setSoldProducts(Set<ProductEntity> soldProducts) {
        this.soldProducts = soldProducts;
    }

    public Set<ProductEntity> getPurchasedProducts() {
        return purchasedProducts;
    }

    public void setPurchasedProducts(Set<ProductEntity> purchasedProducts) {
        this.purchasedProducts = purchasedProducts;
    }

    public Set<EvaluationEntity> getGivenEvaluations() {
        return givenEvaluations;
    }

    public void setGivenEvaluations(Set<EvaluationEntity> givenEvaluations) {
        this.givenEvaluations = givenEvaluations;
    }

    public Set<EvaluationEntity> getReceivedEvaluations() {
        return receivedEvaluations;
    }

    public void setReceivedEvaluations(Set<EvaluationEntity> receivedEvaluations) {
        this.receivedEvaluations = receivedEvaluations;
    }

    public void prepareForPermanentDeletion() {
        this.username = "utilizador_apagado_" + UUID.randomUUID();
        this.firstName = "Criador";
        this.lastName = "Excluído";
        this.email = null;
        this.phone = null;
        this.picture = null;
        this.token = null;
        this.isActive = false;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (object == null || getClass() != object.getClass()) {
            return false;
        }
        UserEntity that = (UserEntity) object;
        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", isActive=" + isActive +
                ", isAdmin=" + isAdmin +
                '}';
    }
}

