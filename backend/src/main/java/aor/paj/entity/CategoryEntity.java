package aor.paj.entity;

import java.io.Serializable;
import java.util.List;

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

@Entity
@Table(name = "categories")
@NamedQueries({
    @NamedQuery(name = "Category.findAll", query = "SELECT c FROM CategoryEntity c"),
    @NamedQuery(name = "Category.findById", query = "SELECT c FROM CategoryEntity c WHERE c.id = :id"),
    @NamedQuery(name = "Category.findByName", query = "SELECT c FROM CategoryEntity c WHERE c.name = :name")
})
public class CategoryEntity implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  private Long id;

  @Column(name = "category_name", nullable = false, unique = true, length = 50)
  private String name;

  @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
  private List<ProductEntity> products;

  // Constructors
  public CategoryEntity() {
  }

  public CategoryEntity(String name) {
    this.name = name;
  }

  // Getters and setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<ProductEntity> getProducts() {
    return products;
  }

  public void setProducts(List<ProductEntity> products) {
    this.products = products;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;

    CategoryEntity category = (CategoryEntity) o;

    if (id != null ? !id.equals(category.id) : category.id != null)
      return false;
    return name != null ? name.equals(category.name) : category.name == null;
  }

  @Override
  public int hashCode() {
    int result = id != null ? id.hashCode() : 0;
    result = 31 * result + (name != null ? name.hashCode() : 0);
    return result;
  }

  @Override
  public String toString() {
    return "CategoryEntity{" +
        "id=" + id +
        ", name='" + name + '\'' +
        '}';
  }
}