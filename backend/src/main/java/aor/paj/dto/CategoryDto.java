package aor.paj.dto;

import java.io.Serializable;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

/**
 * Data Transfer Object for Category
 * Contains only the data needed for API communication
 */
@XmlRootElement(name = "category")
@XmlAccessorType(XmlAccessType.FIELD)
public class CategoryDto implements Serializable {

  private static final long serialVersionUID = 1L;

  @XmlElement(name = "id")
  private Long id;

  @XmlElement(name = "name")
  private String name;

  // Default constructor
  public CategoryDto() {
  }

  // Constructor with name
  public CategoryDto(String name) {
    this.name = name;
  }

  // Constructor with id and name
  public CategoryDto(Long id, String name) {
    this.id = id;
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

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;

    CategoryDto that = (CategoryDto) o;

    if (id != null ? !id.equals(that.id) : that.id != null)
      return false;
    return name != null ? name.equals(that.name) : that.name == null;
  }

  @Override
  public int hashCode() {
    int result = id != null ? id.hashCode() : 0;
    result = 31 * result + (name != null ? name.hashCode() : 0);
    return result;
  }

  @Override
  public String toString() {
    return "CategoryDto{" +
        "id=" + id +
        ", name='" + name + '\'' +
        '}';
  }
}