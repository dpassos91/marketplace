const calculateAverageRating = (evaluations) => {
    if (!evaluations || evaluations.length === 0) {
      return { averageRating: 0, averageRatingStars: 'N/A' };
    }
  
    const totalRating = evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0);
    const averageRating = totalRating / evaluations.length;
    const averageRatingStars = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));
  
    return { averageRating, averageRatingStars };
  };
  
  export default calculateAverageRating;
  