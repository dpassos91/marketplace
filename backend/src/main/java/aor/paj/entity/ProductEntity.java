package aor.paj.entity;

import java.io.Serializable;
import java.time.LocalDate;

import aor.paj.util.ProductStateId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
@NamedQueries({
    @NamedQuery(name = "Product.findAll", query = "SELECT p FROM ProductEntity p"),
    @NamedQuery(name = "Product.findById", query = "SELECT p FROM ProductEntity p WHERE p.id = :id"),
    @NamedQuery(name = "Product.findByTitle", query = "SELECT p FROM ProductEntity p WHERE LOWER(p.title) LIKE LOWER(:title)"),
    @NamedQuery(name = "Product.findByLocation", query = "SELECT p FROM ProductEntity p WHERE LOWER(p.location) LIKE LOWER(:location)"),
    @NamedQuery(name = "Product.findByStateId", query = "SELECT p FROM ProductEntity p WHERE p.stateId = :stateId"),
    @NamedQuery(name = "Product.findByActive", query = "SELECT p FROM ProductEntity p WHERE p.active = :active"),
    @NamedQuery(name = "Product.findByCategory", query = "SELECT p FROM ProductEntity p WHERE p.category.id = :categoryId"),
    @NamedQuery(name = "Product.findByUser", query = "SELECT p FROM ProductEntity p WHERE p.seller.id = :userId"),
    @NamedQuery(name = "Product.findByBuyer", query = "SELECT p FROM ProductEntity p WHERE p.buyer.id = :userId AND p.stateId = :stateId"),
    @NamedQuery(name = "Product.findByEditDate", query = "SELECT p FROM ProductEntity p WHERE p.editDate IS NOT NULL")
})
public class ProductEntity implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_id")
  private Long id;

  @Column(name = "product_title", nullable = false, length = 512)
  private String title;

  @Column(name = "product_description", nullable = false, columnDefinition = "TEXT")
  private String description;

  @Column(name = "product_price", nullable = false)
  private Double price;

  @Column(name = "product_location", nullable = false, length = 512)
  private String location;

  @Column(name = "product_image_url", length = 1024)
  private String imageUrl;

  @Column(name = "status")
  private Integer stateId;

  @Column(name = "product_active", nullable = false)
  private boolean active;

  @Column(name = "product_date", nullable = false)
  private LocalDate date;

  @Column(name = "product_edit_date")
  private LocalDate editDate;

  @ManyToOne
  @JoinColumn(name = "category_category_id", referencedColumnName = "category_id", nullable = false)
  private CategoryEntity category;

  @ManyToOne
  @JoinColumn(name = "seller_id", nullable = true)
  private UserEntity seller;

  @Column(name = "seller_name")
  private String sellerName;

  @ManyToOne
  @JoinColumn(name = "buyer_id", nullable = true)
  private UserEntity buyer;

  public ProductEntity() {}

  public ProductEntity(String title, String description, Double price, String location,
      Integer stateId, boolean active, LocalDate date, CategoryEntity category,
      UserEntity seller, String imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.location = location;
    this.stateId = stateId;
    this.active = active;
    this.date = date;
    this.category = category;
    this.seller = seller;
    this.imageUrl = imageUrl;
  }

  public ProductEntity(String title, String description, Double price, String location,
      String statusDescription, boolean active, LocalDate date, CategoryEntity category,
      UserEntity seller, String imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.location = location;
    if (statusDescription != null) {
      ProductStateId state = ProductStateId.fromDescription(statusDescription);
      if (state != null) {
        this.stateId = state.getStateId();
      }
    }
    this.active = active;
    this.date = date;
    this.category = category;
    this.seller = seller;
    this.imageUrl = imageUrl;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

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

  public Integer getStateId() {
    return stateId;
  }

  public void setStateId(Integer stateId) {
    this.stateId = stateId;
    if (stateId != null) {
      try {
        ProductStateId state = ProductStateId.fromStateId(stateId);
        this.active = state.isActive();
      } catch (IllegalArgumentException e) {
        this.active = false;
      }
    }
  }

  public String getStatus() {
    return stateId != null ? ProductStateId.fromStateId(stateId).getDescription() : null;
  }

  public void setStatus(String statusDescription) {
    if (statusDescription != null) {
      ProductStateId state = ProductStateId.fromDescription(statusDescription);
      if (state != null) {
        setStateId(state.getStateId());
      }
    }
  }

  public void setProductState(ProductStateId state) {
    if (state != null) {
      setStateId(state.getStateId());
    } else {
      this.stateId = null;
    }
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public LocalDate getEditDate() {
    return editDate;
  }

  public void setEditDate(LocalDate editDate) {
    this.editDate = editDate;
  }

  public CategoryEntity getCategory() {
    return category;
  }

  public void setCategory(CategoryEntity category) {
    this.category = category;
  }

  public UserEntity getBuyer() {
    return buyer;
  }

  public void setBuyer(UserEntity buyer) {
    this.buyer = buyer;
  }

  public UserEntity getSeller() {
    return seller;
  }

  public void setSeller(UserEntity seller) {
    this.seller = seller;
  }

  public String getSellerName() {
    return sellerName;
  }

  public void setSellerName(String sellerName) {
    this.sellerName = sellerName;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;

    ProductEntity product = (ProductEntity) o;

    return id != null ? id.equals(product.id) : product.id == null;
  }

  @Override
  public int hashCode() {
    return id != null ? id.hashCode() : 0;
  }

  @Override
  public String toString() {
    return "ProductEntity{" +
        "id=" + id +
        ", title='" + title + '\'' +
        ", price=" + price +
        ", status='" + getStatus() + '\'' +
        ", active=" + active +
        '}';
  }
}
