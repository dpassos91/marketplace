package aor.paj.dto;

public class UserProductStatsDto {

    private String username;
    private int totalProducts;
    private int draftProducts;
    private int publishedProducts;
    private int reservedProducts;
    private int purchasedProducts;
    private int inactiveProducts;

    public UserProductStatsDto() {
    }

    public UserProductStatsDto(String username) {
        this.username = username;
        this.totalProducts = 0;
        this.publishedProducts = 0;
        this.reservedProducts = 0;
        this.purchasedProducts = 0;
        this.inactiveProducts = 0;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getDraftProducts() {
        return draftProducts;
    }

    public void setDraftProducts(int draftProducts) {
        this.draftProducts = draftProducts;
    }

    public int getPublishedProducts() {
        return publishedProducts;
    }

    public void setPublishedProducts(int publishedProducts) {
        this.publishedProducts = publishedProducts;
    }

    public int getReservedProducts() {
        return reservedProducts;
    }

    public void setReservedProducts(int reservedProducts) {
        this.reservedProducts = reservedProducts;
    }

    public int getPurchasedProducts() {
        return purchasedProducts;
    }

    public void setPurchasedProducts(int purchasedProducts) {
        this.purchasedProducts = purchasedProducts;
    }

    public int getInactiveProducts() {
        return inactiveProducts;
    }

    public void setInactiveProducts(int inactiveProducts) {
        this.inactiveProducts = inactiveProducts;
    }

    @Override
public String toString() {
    return "UserProductStatsDto{" +
            "username='" + username + '\'' +
            ", totalProducts=" + totalProducts +
            ", publishedProducts=" + publishedProducts +
            ", reservedProducts=" + reservedProducts +
            ", purchasedProducts=" + purchasedProducts +
            ", inactiveProducts=" + inactiveProducts +
            '}';
}
}
