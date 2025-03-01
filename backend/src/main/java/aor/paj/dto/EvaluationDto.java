package aor.paj.dto;

import java.io.Serializable;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

/**
 * Data Transfer Object for Evaluation
 * Contains only the data needed for API communication
 */
@XmlRootElement(name = "evaluation")
@XmlAccessorType(XmlAccessType.FIELD)
public class EvaluationDto implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(name = "id")
    private Long id;

    @XmlElement(name = "title")
    private String title;

    @XmlElement(name = "comment")
    private String comment;

    @XmlElement(name = "date")
    private String date;

    @XmlElement(name = "rating")
    private Integer rating; // Integer from 1 to 5

    @XmlElement(name = "evaluator_id")
    private Long evaluatorId; // Buyer ID

    @XmlElement(name = "evaluated_id")
    private Long evaluatedId; // Seller ID

    @XmlElement(name = "evaluator_username")
    private String evaluatorUsername; // Buyer username

    @XmlElement(name = "evaluated_username")
    private String evaluatedUsername; // Seller username

    @XmlElement(name = "product_id")
    private Long productId; // Product that was purchased

    @XmlElement(name = "product_title")
    private String productTitle; // Product title for display

    // Default constructor
    public EvaluationDto() {
    }

    // Constructor with all fields
    public EvaluationDto(Long id, String title, String comment, String date,
            Integer rating, Long evaluatorId, Long evaluatedId,
            String evaluatorUsername, String evaluatedUsername, Long productId, String productTitle) {
        this.id = id;
        this.title = title;
        this.comment = comment;
        this.date = date;
        this.rating = rating;
        this.evaluatorId = evaluatorId;
        this.evaluatedId = evaluatedId;
        this.evaluatorUsername = evaluatorUsername;
        this.evaluatedUsername = evaluatedUsername;
        this.productId = productId;
        this.productTitle = productTitle;
    }

    // Simple constructor for basic evaluation info
    public EvaluationDto(String evaluatorUsername, String date, String comment, Integer rating) {
        this.evaluatorUsername = evaluatorUsername;
        this.date = date;
        this.comment = comment;
        this.rating = rating;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Long getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(Long evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public Long getEvaluatedId() {
        return evaluatedId;
    }

    public void setEvaluatedId(Long evaluatedId) {
        this.evaluatedId = evaluatedId;
    }

    public String getEvaluatorUsername() {
        return evaluatorUsername;
    }

    public void setEvaluatorUsername(String evaluatorUsername) {
        this.evaluatorUsername = evaluatorUsername;
    }

    public String getEvaluatedUsername() {
        return evaluatedUsername;
    }

    public void setEvaluatedUsername(String evaluatedUsername) {
        this.evaluatedUsername = evaluatedUsername;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        EvaluationDto that = (EvaluationDto) o;

        return id != null ? id.equals(that.id) : that.id == null;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "EvaluationDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", comment='" + comment + '\'' +
                ", date='" + date + '\'' +
                ", rating=" + rating +
                ", evaluatorUsername='" + evaluatorUsername + '\'' +
                ", productId=" + productId +
                ", productTitle='" + productTitle + '\'' +
                '}';
    }
}