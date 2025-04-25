package aor.paj.entity;

import java.io.Serializable;
import java.time.LocalDate;

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
@Table(name = "evaluations")
@NamedQueries({
    @NamedQuery(name = "Evaluation.findAll", query = "SELECT e FROM EvaluationEntity e"),
    @NamedQuery(name = "Evaluation.findById", query = "SELECT e FROM EvaluationEntity e WHERE e.id = :id"),
    @NamedQuery(name = "Evaluation.findByEvaluator", query = "SELECT e FROM EvaluationEntity e WHERE e.evaluator.id = :evaluatorId"),
    @NamedQuery(name = "Evaluation.findByEvaluated", query = "SELECT e FROM EvaluationEntity e WHERE e.evaluated.id = :evaluatedId")
})
public class EvaluationEntity implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "evaluation_id")
  private Long id;

  @Column(name = "title")
  private String title;

  @Column(name = "comment", length = 500)
  private String comment;

  @Column(name = "date")
  private LocalDate date;

  @Column(name = "rating")
  private Integer rating;

  @ManyToOne
  @JoinColumn(name = "evaluator_id", nullable = true)
  private UserEntity evaluator; // User who gives the evaluation

  @ManyToOne
  @JoinColumn(name = "evaluated_id", nullable = true)
  private UserEntity evaluated; // User who receives the evaluation

  @ManyToOne
  @JoinColumn(name = "product_id")
  private ProductEntity product; // The product that was purchased

  // Constructors
  public EvaluationEntity() {
  }

  public EvaluationEntity(String title, String comment, LocalDate date, Integer rating,
      UserEntity evaluator, UserEntity evaluated, ProductEntity product) {
    this.title = title;
    this.comment = comment;
    this.date = LocalDate.now();
    this.rating = rating;
    this.evaluator = evaluator;
    this.evaluated = evaluated;
    this.product = product;
  }

  // Getters and setters
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

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public Integer getRating() {
    return rating;
  }

  public void setRating(Integer rating) {
    this.rating = rating;
  }

  public UserEntity getEvaluator() {
    return evaluator;
  }

  public void setEvaluator(UserEntity evaluator) {
    this.evaluator = evaluator;
  }

  public UserEntity getEvaluated() {
    return evaluated;
  }

  public void setEvaluated(UserEntity evaluated) {
    this.evaluated = evaluated;
  }

  public ProductEntity getProduct() {
    return product;
  }

  public void setProduct(ProductEntity product) {
    this.product = product;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;

    EvaluationEntity that = (EvaluationEntity) o;

    return id != null ? id.equals(that.id) : that.id == null;
  }

  @Override
  public int hashCode() {
    return id != null ? id.hashCode() : 0;
  }

  @Override
  public String toString() {
    return "EvaluationEntity{" +
        "id=" + id +
        ", title='" + title + '\'' +
        ", date=" + date +
        ", rating=" + rating +
        '}';
  }
}