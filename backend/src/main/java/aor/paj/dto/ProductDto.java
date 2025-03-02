package aor.paj.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import aor.paj.util.ProductStateId;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlTransient;

/**
 * Data Transfer Object for Product
 * Contains only the data needed for API communication
 */
@XmlRootElement(name = "product")
@XmlAccessorType(XmlAccessType.FIELD)
public class ProductDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(name = "id")
    private Long id;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "description")
    private String description;

    @XmlElement(name = "price")
    private Double price;

    @XmlElement(name = "location")
    private String location;

    @XmlElement(name = "imageUrl")
    private String imageUrl;

    @XmlElement(name = "status")
    private String status;

    @XmlElement(name = "active")
    private boolean active;

    @XmlElement(name = "date")
    private String date;

    @XmlElement(name = "edit_date")
    private String editDate;

    @XmlElement(name = "category_id")
    private Long categoryId;

    @XmlElement(name = "category_name")
    private String categoryName;

    @XmlElement(name = "seller_id")
    private Long sellerId;

    @XmlElement(name = "seller_username")
    private String sellerUsername;

    @XmlElement(name = "buyer_id")
    private Long buyerId;

    @XmlElement(name = "buyer_username")
    private String buyerUsername;

    @XmlElement(name = "evaluations")
    private List<EvaluationDto> evaluations;

    @XmlTransient
    private ProductStateId productState;

    // Default constructor
    public ProductDto() {
        this.evaluations = new ArrayList<>();
        this.active = true;
    }

    // Constructor with essential fields
    public ProductDto(String title, String description, Double price, String location, String imageUrl,
            Long categoryId, String categoryName, Long sellerId, String sellerUsername) {
        this();
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.sellerId = sellerId;
        this.sellerUsername = sellerUsername;
        this.status = ProductStateId.DISPONIVEL.getDescription();
        this.date = LocalDate.now().toString();
    }

    // Getter and setter for imageUrl
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Existing getters and setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ProductStateId getProductState() {
        return productState;
    }

    public void setProductState(ProductStateId productState) {
        this.productState = productState;
        this.status = productState.getDescription();
    }

    public void setEstadoById(int stateId) {
        setProductState(ProductStateId.fromStateId(stateId));
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getEditDate() {
        return editDate;
    }

    public void setEditDate(String editDate) {
        this.editDate = editDate;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerUsername() {
        return sellerUsername;
    }

    public void setSellerUsername(String sellerUsername) {
        this.sellerUsername = sellerUsername;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getBuyerUsername() {
        return buyerUsername;
    }

    public void setBuyerUsername(String buyerUsername) {
        this.buyerUsername = buyerUsername;
    }

    public List<EvaluationDto> getEvaluations() {
        return evaluations != null ? new ArrayList<>(evaluations) : new ArrayList<>();
    }

    public void setEvaluations(List<EvaluationDto> evaluations) {
        this.evaluations = evaluations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        ProductDto that = (ProductDto) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "ProductDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", price=" + price +
                ", status='" + status + '\'' +
                ", active=" + active +
                '}';
    }
}