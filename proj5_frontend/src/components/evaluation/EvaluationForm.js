import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

function EvaluationForm({ initialEvaluation, onSave, onCancel }) {
  const intl = useIntl();
  const [title, setTitle] = useState(initialEvaluation?.title || '');
  const [comment, setComment] = useState(initialEvaluation?.comment || '');
  const [rating, setRating] = useState(initialEvaluation?.rating || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvalid = (e) => {
    const fieldName = e.target.name;

    let messageId = '';
    if (fieldName === 'title') messageId = 'evaluationForm.error.title';
    if (fieldName === 'comment') messageId = 'evaluationForm.error.comment';
    if (fieldName === 'rating' && !e.target.value) messageId = 'evaluationForm.error.rating.required';
    if (fieldName === 'rating' && (e.target.value < 1 || e.target.value > 5)) {
      messageId = 'evaluationForm.error.rating.invalid';
    }

    if (messageId) {
      e.target.setCustomValidity(intl.formatMessage({ id: messageId }));
    }
  };

  const handleInput = (e) => {
    e.target.setCustomValidity('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await onSave({
        ...initialEvaluation,
        title,
        comment,
        rating,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <strong>
          <FormattedMessage id="evaluationForm.label.title" defaultMessage="Título" />
        </strong>
      </label>
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onInvalid={handleInvalid}
        onInput={handleInput}
        placeholder={intl.formatMessage({
          id: 'evaluationForm.placeholder.title',
          defaultMessage: 'Insira o título',
        })}
        required
      />

      <label>
        <strong>
          <FormattedMessage id="evaluationForm.label.comment" defaultMessage="Comentário" />
        </strong>
      </label>
      <textarea
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onInvalid={handleInvalid}
        onInput={handleInput}
        placeholder={intl.formatMessage({
          id: 'evaluationForm.placeholder.comment',
          defaultMessage: 'Escreva o seu comentário',
        })}
        required
      />

      <label>
        <strong>
          <FormattedMessage id="evaluationForm.label.rating" defaultMessage="Nota (1 a 5)" />
        </strong>
      </label>
      <input
        type="number"
        name="rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        onInvalid={handleInvalid}
        onInput={handleInput}
        placeholder={intl.formatMessage({
          id: 'evaluationForm.placeholder.rating',
          defaultMessage: 'Nota entre 1 e 5',
        })}
        min="1"
        max="5"
        required
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? intl.formatMessage({ id: 'admin.common.saving', defaultMessage: 'A guardar...' })
          : intl.formatMessage({ id: 'admin.common.save', defaultMessage: 'Guardar' })}
      </button>
      <button type="button" onClick={onCancel}>
        <FormattedMessage id="admin.common.cancel" defaultMessage="Cancelar" />
      </button>
    </form>
  );
}

export default EvaluationForm;

