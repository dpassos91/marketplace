'use strict';

import * as evaluationAPI from '../api/evaluationAPI.js';
import { formatDate } from '../utils/dateUtils.js';

// Create HTML for a single evaluation
function createEvaluationElement(evaluation) {
  const ratingStars =
    '★'.repeat(evaluation.rating) + '☆'.repeat(5 - evaluation.rating);

  return `
    <div class="evaluation-card" data-evaluation-id="${evaluation.id}">
      <div class="evaluation-header">
        <h4>${evaluation.title}</h4>
        <div class="evaluation-rating">${ratingStars}</div>
        <div class="evaluation-date">${formatDate(
          evaluation.evaluationDate
        )}</div>
      </div>
      <div class="evaluation-body">
        <p>${evaluation.comment}</p>
      </div>
      ${
        evaluation.canEdit
          ? `
        <div class="evaluation-actions">
          <button class="btn btn-sm btn-primary edit-evaluation-btn">Editar</button>
          <button class="btn btn-sm btn-danger delete-evaluation-btn">Apagar</button>
        </div>
      `
          : ''
      }
    </div>
  `;
}

// Load and display evaluations for a seller
export async function loadSellerEvaluations(sellerId, containerSelector) {
  try {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '<div class="loading">A carregar avaliações...</div>';

    const evaluations = await evaluationAPI.getEvaluationsForSeller(sellerId);

    if (evaluations && evaluations.length > 0) {
      // Calculate average rating
      const totalRating = evaluations.reduce(
        (sum, evaluation) => sum + evaluation.rating,
        0
      );
      const averageRating = totalRating / evaluations.length;
      const averageRatingStars =
        '★'.repeat(Math.round(averageRating)) +
        '☆'.repeat(5 - Math.round(averageRating));

      let html = `
        <div class="average-rating">
          <h3>Rating médio: ${averageRatingStars} (${averageRating.toFixed(
        1
      )})</h3>
          <p>${evaluations.length} evaluation${
        evaluations.length !== 1 ? 's' : ''
      }</p>
        </div>
        <div class="evaluations-list">
      `;

      evaluations.forEach(evaluation => {
        html += createEvaluationElement(evaluation);
      });

      html += '</div>';
      container.innerHTML = html;

      // Add event listeners to edit and delete buttons
      attachEvaluationEventHandlers(container, sellerId);
    } else {
      container.innerHTML = '<p>Este vendedor ainda não foi avaliado.</p>';
    }

    // Add "Add Evaluation" button if user is logged in and not viewing their own profile
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.id !== sellerId) {
      const addButton = document.createElement('button');
      addButton.className = 'btn btn-primary mt-3';
      addButton.textContent = 'Avaliar Vendedor';
      addButton.addEventListener('click', () =>
        showAddEvaluationModal(sellerId)
      );
      container.appendChild(addButton);
    }
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
    document.querySelector(containerSelector).innerHTML =
      '<p class="text-danger">Falha ao carregar avaliações. Por favor volte a tentar mais tarde.</p>';
  }
}

// Attach event handlers to evaluation action buttons
function attachEvaluationEventHandlers(container, sellerId) {
  // Edit buttons
  container.querySelectorAll('.edit-evaluation-btn').forEach(button => {
    button.addEventListener('click', async e => {
      const evaluationCard = e.target.closest('.evaluation-card');
      const evaluationId = evaluationCard.dataset.evaluationId;

      try {
        const evaluation = await evaluationAPI.getEvaluationById(evaluationId);
        if (evaluation) {
          showEditEvaluationModal(evaluation, sellerId);
        }
      } catch (error) {
        console.error('Erro no fetch da avaliação:', error);
        alert('Falha ao carregar os detalhes da avaliação.');
      }
    });
  });

  // Delete buttons
  container.querySelectorAll('.delete-evaluation-btn').forEach(button => {
    button.addEventListener('click', async e => {
      if (confirm('Tem a certeza que pretende eliminar esta review?')) {
        const evaluationCard = e.target.closest('.evaluation-card');
        const evaluationId = evaluationCard.dataset.evaluationId;

        try {
          await evaluationAPI.deleteEvaluation(evaluationId);
          evaluationCard.remove();
          alert('Review eliminada com sucesso!');

          // Reload evaluations to update average rating
          loadSellerEvaluations(
            sellerId,
            evaluationCard.parentElement.parentElement
          );
        } catch (error) {
          console.error('Erro ao eliminar a avaliação:', error);
          alert('Falha ao apagar a avaliação.');
        }
      }
    });
  });
}

// Show modal for adding a new evaluation
export function showAddEvaluationModal(sellerId) {
  // Create modal HTML
  const modalHtml = `
    <div class="modal fade" id="evaluationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adicionar Review</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="evaluationForm">
              <div class="mb-3">
                <label for="evaluationTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="evaluationTitle" required maxlength="100">
              </div>
              <div class="mb-3">
                <label for="evaluationRating" class="form-label">Rating</label>
                <div class="rating-selector">
                  <div class="stars">
                    <i class="bi bi-star" data-rating="1"></i>
                    <i class="bi bi-star" data-rating="2"></i>
                    <i class="bi bi-star" data-rating="3"></i>
                    <i class="bi bi-star" data-rating="4"></i>
                    <i class="bi bi-star" data-rating="5"></i>
                  </div>
                  <input type="hidden" id="evaluationRating" value="0" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="evaluationComment" class="form-label">Comentário</label>
                <textarea class="form-control" id="evaluationComment" rows="3" required maxlength="500"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="submitEvaluation">Submit</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Set up star rating selector
  const stars = document.querySelectorAll('.stars i');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      document.getElementById('evaluationRating').value = rating;

      // Update star display
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove('bi-star');
          s.classList.add('bi-star-fill');
        } else {
          s.classList.remove('bi-star-fill');
          s.classList.add('bi-star');
        }
      });
    });
  });

  // Set up form submission
  document
    .getElementById('submitEvaluation')
    .addEventListener('click', async () => {
      const form = document.getElementById('evaluationForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const evaluationData = {
        title: document.getElementById('evaluationTitle').value,
        rating: parseInt(document.getElementById('evaluationRating').value),
        comment: document.getElementById('evaluationComment').value,
        sellerId: sellerId,
      };

      if (evaluationData.rating === 0) {
        alert('Por favor selecione um rating para esta review.');
        return;
      }

      try {
        await evaluationAPI.addEvaluation(evaluationData);
        alert('Review submetida com sucesso!');

        // Close modal and refresh evaluations
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('evaluationModal')
        );
        modal.hide();

        // Reload evaluations
        loadSellerEvaluations(sellerId, '#evaluationsContainer');

        // Remove modal from DOM after hiding
        document
          .getElementById('evaluationModal')
          .addEventListener('hidden.bs.modal', function () {
            this.remove();
          });
      } catch (error) {
        console.error('Erro ao submeter a avaliação:', error);
        alert('Falha na submissão da avaliação.');
      }
    });

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('evaluationModal'));
  modal.show();
}

// Show modal for editing an existing evaluation
export function showEditEvaluationModal(evaluation, sellerId) {
  // Create modal HTML (similar to add modal but with existing data)
  const modalHtml = `
    <div class="modal fade" id="editEvaluationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Review</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="editEvaluationForm">
              <div class="mb-3">
                <label for="editEvaluationTitle" class="form-label">Título</label>
                <input type="text" class="form-control" id="editEvaluationTitle" required maxlength="100" value="${
                  evaluation.title
                }">
              </div>
              <div class="mb-3">
                <label for="editEvaluationRating" class="form-label">Rating</label>
                <div class="rating-selector">
                  <div class="stars">
                    <i class="bi ${
                      evaluation.rating >= 1 ? 'bi-star-fill' : 'bi-star'
                    }" data-rating="1"></i>
                    <i class="bi ${
                      evaluation.rating >= 2 ? 'bi-star-fill' : 'bi-star'
                    }" data-rating="2"></i>
                    <i class="bi ${
                      evaluation.rating >= 3 ? 'bi-star-fill' : 'bi-star'
                    }" data-rating="3"></i>
                    <i class="bi ${
                      evaluation.rating >= 4 ? 'bi-star-fill' : 'bi-star'
                    }" data-rating="4"></i>
                    <i class="bi ${
                      evaluation.rating >= 5 ? 'bi-star-fill' : 'bi-star'
                    }" data-rating="5"></i>
                  </div>
                  <input type="hidden" id="editEvaluationRating" value="${
                    evaluation.rating
                  }" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="editEvaluationComment" class="form-label">Comentário</label>
                <textarea class="form-control" id="editEvaluationComment" rows="3" required maxlength="500">${
                  evaluation.comment
                }</textarea>
              </div>
              <input type="hidden" id="evaluationId" value="${evaluation.id}">
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" id="updateEvaluation">Atualizar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal to document
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Set up star rating selector
  const stars = document.querySelectorAll('#editEvaluationModal .stars i');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      document.getElementById('editEvaluationRating').value = rating;

      // Update star display
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove('bi-star');
          s.classList.add('bi-star-fill');
        } else {
          s.classList.remove('bi-star-fill');
          s.classList.add('bi-star');
        }
      });
    });
  });

  // Set up form submission
  document
    .getElementById('updateEvaluation')
    .addEventListener('click', async () => {
      const form = document.getElementById('editEvaluationForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const evaluationData = {
        id: document.getElementById('evaluationId').value,
        title: document.getElementById('editEvaluationTitle').value,
        rating: parseInt(document.getElementById('editEvaluationRating').value),
        comment: document.getElementById('editEvaluationComment').value,
      };

      try {
        await evaluationAPI.updateEvaluation(evaluationData);
        alert('Avaliação atualizada com sucesso!');

        // Close modal and refresh evaluations
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('editEvaluationModal')
        );
        modal.hide();

        // Reload evaluations
        loadSellerEvaluations(sellerId, '#evaluationsContainer');

        // Remove modal from DOM after hiding
        document
          .getElementById('editEvaluationModal')
          .addEventListener('hidden.bs.modal', function () {
            this.remove();
          });
      } catch (error) {
        console.error('Erro a atualizar a avaliação:', error);
        alert('Falha a atualizar a avaliação.');
      }
    });

  // Show modal
  const modal = new bootstrap.Modal(
    document.getElementById('editEvaluationModal')
  );
  modal.show();
}
