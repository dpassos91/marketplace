package aor.paj.dto;

import java.util.List;

public class DashboardOverviewDto {

    private int totalUsers;
    private int confirmedUsers;
    private int totalProducts;
    private int draftProducts;
    private int publishedProducts;
    private int reservedProducts;
    private int purchasedProducts;
    private int inactiveProducts;
    private List<CategoryCountDto> popularCategories;
    private List<UserProductStatsDto> productsPerUser;
    private double averageTimeToPurchase;
    private List<UserRegistrationStatsDto> usersOverTime;
    private List<ProductPurchaseStatsDto> productsPurchasedOverTime;

    // Getters e Setters
    public int getTotalUsers() {
        return totalUsers;
    }
    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public int getConfirmedUsers() {
        return confirmedUsers;
    }
    public void setConfirmedUsers(int confirmedUsers) {
        this.confirmedUsers = confirmedUsers;
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
    public void setInactiveProducts(int purchasedProducts) {
        this.inactiveProducts = purchasedProducts;
    }

    public List<CategoryCountDto> getPopularCategories() {
        return popularCategories;
    }
    public void setPopularCategories(List<CategoryCountDto> popularCategories) {
        this.popularCategories = popularCategories;
    }

    public List<UserProductStatsDto> getProductsPerUser() {
        return productsPerUser;
    }
    public void setProductsPerUser(List<UserProductStatsDto> productsPerUser) {
        this.productsPerUser = productsPerUser;
    }

    public double getAverageTimeToPurchase() {
        return averageTimeToPurchase;
    }
    public void setAverageTimeToPurchase(double averageTimeToPurchase) {
        this.averageTimeToPurchase = averageTimeToPurchase;
    }

    public List<UserRegistrationStatsDto> getUsersOverTime() {
        return usersOverTime;
    }
    public void setUsersOverTime(List<UserRegistrationStatsDto> usersOverTime) {
        this.usersOverTime = usersOverTime;
    }

    public List<ProductPurchaseStatsDto> getProductsPurchasedOverTime() {
        return productsPurchasedOverTime;
    }
    public void setProductsPurchasedOverTime(List<ProductPurchaseStatsDto> productsPurchasedOverTime) {
        this.productsPurchasedOverTime = productsPurchasedOverTime;
    }
}

