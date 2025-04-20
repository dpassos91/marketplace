package aor.paj.dto;

import java.util.Map;

public class UserProfileDto {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String photoUrl;

    private int totalProducts;
    private Map<String, Long> productsByState;

    public UserProfileDto() {
    }

    public UserProfileDto(String firstName, String lastName, String username, String email, String photoUrl,
                          int totalProducts, Map<String, Long> productsByState) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.photoUrl = photoUrl;
        this.totalProducts = totalProducts;
        this.productsByState = productsByState;
    }

    // Getters e Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Map<String, Long> getProductsByState() {
        return productsByState;
    }

    public void setProductsByState(Map<String, Long> productsByState) {
        this.productsByState = productsByState;
    }
}
