package aor.paj.entity;

import java.io.Serializable;
import java.util.Set;

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
        @NamedQuery(name = "User.findById", query = "SELECT user FROM UserEntity user WHERE user.id = :id"),
        @NamedQuery(name = "User.findByActive", query = "SELECT user FROM UserEntity user WHERE user.isActive = :isActive"),
        @NamedQuery(name = "User.findAllUsername", query = "SELECT user.username FROM UserEntity user"),
        @NamedQuery(name = "User.findByUsername", query = "SELECT user.username FROM UserEntity user WHERE user.username = :username"),
        @NamedQuery(name = "User.findByToken", query = "SELECT user.token FROM UserEntity user WHERE user.token = :token")
})
public class UserEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // gera o ID automaticamente
    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, updatable = false)
    private String username;

    @Column(name = "first_name", nullable = false, unique = false, updatable = true)
    private String firstName;

    @Column(name = "last_name", nullable = false, unique = false, updatable = true)
    private String lastName;

    @Column(name = "password", nullable = false, unique = false, updatable = true)
    private String password;

    @Column(name = "token", nullable = true, unique = true, updatable = true)
    private String token;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true, updatable = true)
    private String email;

    @NotBlank
    @Column(name = "phone", nullable = false, unique = false, updatable = true)
    private String phone;

    @Column(name = "is_active", nullable = false, unique = false, updatable = true)
    private boolean isActive;

    @Column(name = "is_admin", nullable = false, unique = false, updatable = true)
    private boolean isAdmin;

    // TODO: Dúvidas sobre "cascade" e "orphanRemoval"
    // "cascade" permite que operações no UserEntity sejam propagadas para os
    // produtos à venda. Faz sentido aplicá-lo aqui?
    // "orphanRemoval" remove produtos se o UserEntity for apagado. Isso é
    // desejável?
    @OneToMany(mappedBy = "seller", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private Set<ProductEntity> soldProducts;

    @OneToMany(mappedBy = "buyer")
    private Set<ProductEntity> purchasedProducts;

    @OneToMany(mappedBy = "evaluator", cascade = CascadeType.ALL)
    private Set<EvaluationEntity> givenEvaluations;

    @OneToMany(mappedBy = "evaluated", cascade = CascadeType.ALL)
    private Set<EvaluationEntity> receivedEvaluations;

    // Constructors
    public UserEntity() {
    }

    public UserEntity(String username, String firstName, String lastName, String password, String token,
            String email, String phone, boolean isActive, boolean isAdmin) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        // Directly set the password to avoid calling an overridable method in the
        // constructor
        this.password = password != null && !password.startsWith("$2a$") ? BCrypt.hashpw(password, BCrypt.gensalt(12))
                : password;
        this.token = token;
        this.email = email;
        this.phone = phone;
        this.isActive = isActive;
        this.isAdmin = isAdmin;
    }

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

    /**
     * Sets the password for the user. If the password is not already hashed, it
     * will
     * hash it using BCrypt.
     * 
     * @param password the password to set
     * @see org.mindrot.jbcrypt.BCrypt
     */
    public void setPassword(String password) {
        // Only hash if it's not already hashed (BCrypt passwords start with $2a$)
        if (password != null && !password.startsWith("$2a$")) {
            this.password = BCrypt.hashpw(password, BCrypt.gensalt(12));
        } else {
            this.password = password;
        }
    }

    /**
     * Checks if the given password matches the user's password.
     * 
     * @param plainPassword the password to check
     * @return true if the password matches, false otherwise
     * @see org.mindrot.jbcrypt.BCrypt
     */
    public boolean checkPassword(String plainPassword) {
        return BCrypt.checkpw(plainPassword, this.password);
    }

    /**
     * Updates the user's password if the current password is correct.
     * 
     * @param currentPassword the current password
     * @param newPassword     the new password
     * @return true if the password was updated, false otherwise
     */
    public boolean updatePassword(String currentPassword, String newPassword) {
        // Verify the current password is correct before updating
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

    @Override
    public boolean equals(Object object) {
        // Verifica se as instâncias são a mesma (mesmo endereço de memória)
        if (this == object) {
            return true;
        }
        // Verifica se object é nulo ou de classe diferente
        if (object == null || getClass() != object.getClass()) {
            return false;
        }
        // Como já sabe que object é da classe UserEntity, faz o cast sem recear uma
        // ClassCastException
        UserEntity that = (UserEntity) object;
        // Verifica se o id da instância atual não é nulo (se não for, compara com o id
        // do outro objeto)
        if (id != null) {
            return id.equals(that.id);
        } else {
            return that.id == null; // Se o id da instância for nulo, vai verificar se o id de object também é nulo
        }
    }

    @Override
    public int hashCode() {
        if (id != null) {
            return id.hashCode();
        } else {
            return 0;
        }
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
