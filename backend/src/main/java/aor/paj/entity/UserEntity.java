package aor.paj.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "user")
@NamedQueries({
        @NamedQuery(name = "User.findAll", query = "SELECT user FROM UserEntity user"),
        @NamedQuery(name = "User.findById", query = "SELECT user FROM UserEntity user WHERE user.id = :id"),
        @NamedQuery(name = "User.findByActive", query = "SELECT user FROM UserEntity user WHERE user.isActive = :isActive"),
})
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

    // TODO: Dúvidas sobre "cascade" e "orphanRemoval"
    // "cascade" permite que operações no UserEntity sejam propagadas para os produtos à venda. Faz sentido aplicá-lo aqui?
    // "orphanRemoval" remove produtos se o UserEntity for apagado. Isso é desejável?
    @OneToMany(mappedBy = "seller")
    private Set<ProductEntity> soldProducts;

    @OneToMany(mappedBy = "buyer")
    private Set<ProductEntity> purchasedProducts;

    @OneToMany(mappedBy = "seller")
    private Set<EvaluationEntity> givenEvaluations;

    @OneToMany(mappedBy = "buyer")
    private Set<EvaluationEntity> receivedEvaluations;

    // Constructors
    public UserEntity() {}

    public UserEntity(String username, String firstName, String lastName, String password, String token,
                      String email, String phone, boolean isActive, boolean isAdmin) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
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
        // Como já sabe que object é da classe UserEntity, faz o cast sem recear uma ClassCastException
        UserEntity that = (UserEntity) object;
        // Verifica se o id da instância atual não é nulo (se não for, compara com o id do outro objeto)
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
