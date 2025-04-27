package aor.paj.dto;

import java.time.LocalDate;

public class ProductPurchaseStatsDto {

    private String date; // formato ISO 8601: "2024-04-25"
    private int purchasedProducts;

    public ProductPurchaseStatsDto() {
    }

    public ProductPurchaseStatsDto(String date, int purchasedProducts) {
        this.date = date;
        this.purchasedProducts = purchasedProducts;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getPurchasedProducts() {
        return purchasedProducts;
    }

    public void setPurchasedProducts(int purchasedProducts) {
        this.purchasedProducts = purchasedProducts;
    }
}
