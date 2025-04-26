package aor.paj.dto;

import java.time.LocalDate;

public class ProductPurchaseStatsDto {

    private LocalDate date; // formato ISO 8601: "2024-04-25"
    private int purchasedProducts;

    public ProductPurchaseStatsDto() {
    }

    public ProductPurchaseStatsDto(LocalDate date, int purchasedProducts) {
        this.date = date;
        this.purchasedProducts = purchasedProducts;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getPurchasedProducts() {
        return purchasedProducts;
    }

    public void setPurchasedProducts(int purchasedProducts) {
        this.purchasedProducts = purchasedProducts;
    }
}
