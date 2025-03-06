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
          <button class="btn-primary edit-evaluation-btn">Editar</button>
          <button class="btn-danger delete-evaluation-btn">Apagar</button>
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
    // Get container and validate it exists
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Show loading indicator
    container.innerHTML =
      '<div class="loading-spinner">A carregar avaliações...</div>';

    // Fetch data
    const evaluations = await evaluationAPI.getEvaluationsForSeller(sellerId);
    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    // Find the container for the evaluation button (.reviewBtnsContainer)
    // This is separated from the evaluations display logic
    const reviewBtnsContainer = document.querySelector('.reviewBtnsContainer');
    if (reviewBtnsContainer) {
      appendAddEvaluationButtonIfNeeded(
        reviewBtnsContainer,
        currentUser,
        sellerId
      );
    }

    // Check if we have evaluations
    if (!evaluations || evaluations.length === 0) {
      container.innerHTML = '<p>Este vendedor ainda não foi avaliado.</p>';
      return;
    }

    // Process evaluations
    prepareEvaluationsData(evaluations, currentUser);

    // Render evaluations
    renderEvaluationsUI(container, evaluations, sellerId);
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
    document.querySelector(containerSelector).innerHTML =
      '<p class="text-danger">Falha ao carregar avaliações. Por favor volte a tentar mais tarde.</p>';
  }
}

// Helper functions to break down the main function logic
function prepareEvaluationsData(evaluations, currentUser) {
  // Add canEdit flag to each evaluation
  evaluations.forEach(evaluation => {
    // User can edit if they're the author of the evaluation or if they have admin privileges
    evaluation.canEdit =
      currentUser &&
      (String(evaluation.evaluatorId) === String(currentUser.id) ||
        currentUser.admin);
  });
}

function renderEvaluationsUI(container, evaluations, sellerId) {
  // Calculate average rating
  const { averageRating, averageRatingStars } =
    calculateAverageRating(evaluations);

  // Generate evaluation summary HTML
  let html = `
    <div class="average-rating">
      <h3>Rating médio: ${averageRatingStars} (${averageRating.toFixed(1)})</h3>
      <p>${evaluations.length} ${
    evaluations.length !== 1 ? 'evaluations' : 'evaluation'
  }</p>
    </div>
    <div class="evaluations-list">
  `;

  // Add individual evaluation cards
  evaluations.forEach(evaluation => {
    html += createEvaluationElement(evaluation);
  });

  html += '</div>';
  container.innerHTML = html;

  // Add event listeners to edit and delete buttons
  attachEvaluationEventHandlers(container, sellerId);
}

function calculateAverageRating(evaluations) {
  const totalRating = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.rating,
    0
  );
  const averageRating = totalRating / evaluations.length;
  const averageRatingStars =
    '★'.repeat(Math.round(averageRating)) +
    '☆'.repeat(5 - Math.round(averageRating));

  return { averageRating, averageRatingStars };
}

function appendAddEvaluationButtonIfNeeded(container, currentUser, sellerId) {
  // Check if container exists
  if (!container) return;

  // Clear any existing buttons to prevent duplicates
  container.innerHTML = '';

  // Add "Add Evaluation" button if user is logged in and not viewing their own profile
  if (currentUser && currentUser.id !== sellerId) {
    const addButton = document.createElement('button');
    addButton.className = 'btn-primary add-evaluation-btn';
    addButton.textContent = 'Avaliar Vendedor';
    addButton.addEventListener('click', () => showAddEvaluationModal(sellerId));
    container.appendChild(addButton);
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
          loadSellerEvaluations(sellerId, '#evaluationsContainer');
        } catch (error) {
          console.error('Erro ao eliminar a avaliação:', error);
          alert('Falha ao apagar a avaliação.');
        }
      }
    });
  });
}

// Show modal for adding a new evaluation
export async function showAddEvaluationModal(sellerId) {
  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('user'));

  if (!currentUser || !currentUser.id) {
    alert('Precisa de estar autenticado para submeter uma avaliação.');
    return;
  }

  try {
    // Fetch eligible products before showing the modal
    const eligibleProducts =
      await evaluationAPI.getEligibleProductsForEvaluation(currentUser.id);

    // Filter products for this specific seller
    const sellerProducts = eligibleProducts.filter(
      product => product.sellerId == sellerId
    );

    if (sellerProducts.length === 0) {
      alert('Não existem produtos elegíveis para avaliar este vendedor.');
      return;
    }

    // Create custom modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'custom-modal-overlay';
    modalContainer.id = 'evaluationModal';

    // Build product options HTML
    const productOptions = sellerProducts
      .map(product => `<option value="${product.id}">${product.title}</option>`)
      .join('');

    modalContainer.innerHTML = `
      <div class="custom-modal">
        <div class="modal-header">
          <h3>Adicionar Review</h3>
          <button type="button" class="close-modal" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          <form id="evaluationForm">
            <div class="form-group">
              <label for="productSelect">Escolha o produto comprado:</label>
              <select id="productSelect" required>
                <option value="">Selecione um produto</option>
                ${productOptions}
              </select>
            </div>
            <div class="form-group">
              <label for="evaluationTitle">Título</label>
              <input type="text" id="evaluationTitle" required maxlength="100">
            </div>
            <div class="form-group">
              <label for="evaluationRating">Rating</label>
              <div class="rating-selector">
                <div class="stars">
                  <span class="star" data-rating="1">☆</span>
                  <span class="star" data-rating="2">☆</span>
                  <span class="star" data-rating="3">☆</span>
                  <span class="star" data-rating="4">☆</span>
                  <span class="star" data-rating="5">☆</span>
                </div>
                <input type="hidden" id="evaluationRating" value="0" required>
              </div>
            </div>
            <div class="form-group">
              <label for="evaluationComment">Comentário</label>
              <textarea id="evaluationComment" rows="3" required maxlength="500"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary cancel-btn">Cancelar</button>
          <button type="button" class="btn-primary" id="submitEvaluation">Submit</button>
        </div>
      </div>
    `;

    // Add modal to document
    document.body.appendChild(modalContainer);

    // Get modal elements
    const closeButton = modalContainer.querySelector('.close-modal');
    const cancelButton = modalContainer.querySelector('.cancel-btn');
    const stars = modalContainer.querySelectorAll('.stars .star');

    // Handle modal close
    const closeModal = () => {
      document.body.removeChild(modalContainer);
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', e => {
      if (e.target === modalContainer) closeModal();
    });

    // Set up star rating selector
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        document.getElementById('evaluationRating').value = rating;

        // Update star display
        stars.forEach((s, index) => {
          if (index < rating) {
            s.textContent = '★'; // Filled star
          } else {
            s.textContent = '☆'; // Empty star
          }
        });
      });

      // Hover effects for better UX
      star.addEventListener('mouseover', () => {
        const rating = parseInt(star.dataset.rating);

        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add('hover');
          }
        });
      });

      star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hover'));
      });
    });

    // Set up form submission
    document
      .getElementById('submitEvaluation')
      .addEventListener('click', async () => {
        const form = document.getElementById('evaluationForm');

        // Manual form validation
        const productId = document.getElementById('productSelect').value;
        const title = document.getElementById('evaluationTitle').value;
        const rating = parseInt(
          document.getElementById('evaluationRating').value
        );
        const comment = document.getElementById('evaluationComment').value;

        if (!productId) {
          alert('Por favor selecione um produto para avaliar.');
          return;
        }

        if (!title || title.trim() === '') {
          alert('Por favor preencha o título.');
          return;
        }

        if (rating === 0) {
          alert('Por favor selecione um rating para esta review.');
          return;
        }

        if (!comment || comment.trim() === '') {
          alert('Por favor preencha o comentário.');
          return;
        }

        const evaluationData = {
          title: title,
          rating: rating,
          comment: comment,
          evaluatedId: sellerId,
          evaluatorId: currentUser.id,
          productId: parseInt(productId),
        };

        try {
          const response = await evaluationAPI.addEvaluation(evaluationData);

          // Check if response contains an error message from the server
          if (response.error) {
            throw new Error(response.error);
          }

          alert('Review submetida com sucesso!');

          // Close modal and refresh evaluations
          closeModal();

          // Reload evaluations
          loadSellerEvaluations(sellerId, '#evaluationsContainer');
        } catch (error) {
          console.error('Erro ao submeter a avaliação:', error);
          alert(
            `Falha na submissão da avaliação: ${
              error.message || 'Erro desconhecido'
            }`
          );
        }
      });
  } catch (error) {
    console.error('Error fetching eligible products:', error);
    alert(
      'Não foi possível carregar os produtos para avaliação. Tente novamente mais tarde.'
    );
  }
}

// Show modal for editing an existing evaluation
export function showEditEvaluationModal(evaluation, sellerId) {
  // Create custom modal
  const modalContainer = document.createElement('div');
  modalContainer.className = 'custom-modal-overlay';
  modalContainer.id = 'editEvaluationModal';

  modalContainer.innerHTML = `
    <div class="custom-modal">
      <div class="modal-header">
        <h3>Editar Review</h3>
        <button type="button" class="close-modal" aria-label="Close">×</button>
      </div>
      <div class="modal-body">
        <form id="editEvaluationForm">
          <div class="form-group">
            <label for="editEvaluationTitle">Título</label>
            <input type="text" id="editEvaluationTitle" required maxlength="100" value="${
              evaluation.title
            }">
          </div>
          <div class="form-group">
            <label for="editEvaluationRating">Rating</label>
            <div class="rating-selector">
              <div class="stars">
                <span class="star" data-rating="1">${
                  evaluation.rating >= 1 ? '★' : '☆'
                }</span>
                <span class="star" data-rating="2">${
                  evaluation.rating >= 2 ? '★' : '☆'
                }</span>
                <span class="star" data-rating="3">${
                  evaluation.rating >= 3 ? '★' : '☆'
                }</span>
                <span class="star" data-rating="4">${
                  evaluation.rating >= 4 ? '★' : '☆'
                }</span>
                <span class="star" data-rating="5">${
                  evaluation.rating >= 5 ? '★' : '☆'
                }</span>
              </div>
              <input type="hidden" id="editEvaluationRating" value="${
                evaluation.rating
              }" required>
            </div>
          </div>
          <div class="form-group">
            <label for="editEvaluationComment">Comentário</label>
            <textarea id="editEvaluationComment" rows="3" required maxlength="500">${
              evaluation.comment
            }</textarea>
          </div>
          <input type="hidden" id="evaluationId" value="${evaluation.id}">
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-secondary cancel-btn">Cancelar</button>
        <button type="button" class="btn-primary" id="updateEvaluation">Atualizar</button>
      </div>
    </div>
  `;

  // Add modal to document
  document.body.appendChild(modalContainer);

  // Get modal elements
  const closeButton = modalContainer.querySelector('.close-modal');
  const cancelButton = modalContainer.querySelector('.cancel-btn');
  const stars = modalContainer.querySelectorAll('.stars .star');

  // Handle modal close
  const closeModal = () => {
    document.body.removeChild(modalContainer);
  };

  closeButton.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  modalContainer.addEventListener('click', e => {
    if (e.target === modalContainer) closeModal();
  });

  // Set up star rating selector
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      document.getElementById('editEvaluationRating').value = rating;

      // Update star display
      stars.forEach((s, index) => {
        if (index < rating) {
          s.textContent = '★'; // Filled star
        } else {
          s.textContent = '☆'; // Empty star
        }
      });
    });

    // Hover effects for better UX
    star.addEventListener('mouseover', () => {
      const rating = parseInt(star.dataset.rating);

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('hover');
        }
      });
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });
  });

  // Set up form submission
  document
    .getElementById('updateEvaluation')
    .addEventListener('click', async () => {
      // Manual form validation
      const title = document.getElementById('editEvaluationTitle').value;
      const rating = parseInt(
        document.getElementById('editEvaluationRating').value
      );
      const comment = document.getElementById('editEvaluationComment').value;

      if (!title || title.trim() === '') {
        alert('Por favor preencha o título.');
        return;
      }

      if (rating === 0) {
        alert('Por favor selecione um rating para esta review.');
        return;
      }

      if (!comment || comment.trim() === '') {
        alert('Por favor preencha o comentário.');
        return;
      }

      const evaluationId = parseInt(
        document.getElementById('evaluationId').value
      );

      const evaluationData = {
        id: evaluationId,
        title: title,
        rating: rating,
        comment: comment,
        evaluatorId: evaluation.evaluatorId,
      };

      try {
        await evaluationAPI.updateEvaluation(evaluationData);
        alert('Avaliação atualizada com sucesso!');

        // Close modal and refresh evaluations
        closeModal();

        // Reload evaluations
        loadSellerEvaluations(sellerId, '#evaluationsContainer');
      } catch (error) {
        console.error('Erro a atualizar a avaliação:', error);
        alert('Falha a atualizar a avaliação.');
      }
    });
}
