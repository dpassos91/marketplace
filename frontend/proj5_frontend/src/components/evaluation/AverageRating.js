import React from 'react';

function AverageRating({ averageRating, averageRatingStars, numberOfEvaluations }) {
  return (
    <div className="average-rating">
      Média: {averageRatingStars} ({averageRating.toFixed(1)} de 5) - {numberOfEvaluations} avaliações
    </div>
  );
}

export default AverageRating;
