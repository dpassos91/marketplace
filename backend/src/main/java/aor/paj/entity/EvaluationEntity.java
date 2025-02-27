package aor.paj.entity;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "evaluation")
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

  @Column(name = "evaluation_title", nullable = false, length = 512)
  private String title;

  @Column(name = "evaluation_comment", nullable = false, columnDefinition = "TEXT")
  private String comment;

  @Column(name = "evaluation_date", nullable = false)
  private LocalDate date;

  @Column(name = "evaluation_grade", nullable = false, precision = 8, scale = 2)
  private BigDecimal grade;

  @ManyToOne
  @JoinColumn(name = "app_user_user_id", referencedColumnName = "user_id", nullable = false)
  private UserEntity evaluator; // User who gives the evaluation

  @ManyToOne
  @JoinColumn(name = "app_user_user_id1", referencedColumnName = "user_id", nullable = false)
  private UserEntity evaluated; // User who receives the evaluation

  // Constructors
  public EvaluationEntity() {
  }

  public EvaluationEntity(String title, String comment, LocalDate date, BigDecimal grade,
      UserEntity evaluator, UserEntity evaluated) {
    this.title = title;
    this.comment = comment;
    this.date = date;
    this.grade = grade;
    this.evaluator = evaluator;
    this.evaluated = evaluated;
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

  public BigDecimal getGrade() {
    return grade;
  }

  public void setGrade(BigDecimal grade) {
    this.grade = grade;
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
        ", grade=" + grade +
        '}';
  }
}