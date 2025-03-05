'use strict';

import { loadCommonElements } from './loadCommons.js';
import { getTotalUsers, suspendUser, reactivateUser } from './api/userAPI.js';

// Pagination variables
const USERS_PER_PAGE = 10; // Number of users per page
let currentPage = 1; // Current page
let allUsers = []; // Array to store all users

async function initPage() {
  try {
    await loadCommonElements();
    console.log('Common elements loaded successfully');

    const links = document.querySelectorAll('.admin-sidebar a');
    const sections = document.querySelectorAll('.admin-content > section');

    // Function to hide all sections
    function hideAllSections() {
      console.log('Hiding all sections');
      sections.forEach(section => {
        section.classList.add('hidden');
      });
    }

    // Click event for sidebar links
    links.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();

        hideAllSections(); // Hides all sections

        // Show the section corresponding to the clicked link
        let targetId = this.getAttribute('id');
        if (targetId === 'gestao-utilizadores') {
          showSection('utilizadores'); // Ensures the users section is visible
          loadUsers(); // Loads and displays the user table
        } else if (targetId === 'gestao-produtos') {
          showSection('produtos'); // Ensures the products section is visible
        } else if (targetId === 'ver-dashboard') {
          showSection('dashboard'); // Ensures the dashboard section is visible
          loadDashboard(); // Loads user cards when the dashboard loads
        } else if (targetId === 'gestao-avaliacoes') {
          showSection('avaliacoes'); // Ensures the evaluations section is visible
        }
      });
    });

    // Click event for the "View User Profile" button
    const viewUserProfileButton = document.getElementById('viewUserProfile');
    viewUserProfileButton.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('"View User Profile" button clicked');
      showSection('utilizadores'); // Shows the users section
      loadUsers(); // Loads users when the button is clicked
    });

    // Click event for the "Filter" button
    const filtrarButton = document.getElementById('adminFiltrarProd');
    filtrarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Hides all sections
      showSection('filtros'); // Shows the filters section
    });

    // Click event for the "Edit User Products" button
    const editarButton = document.getElementById('adminEditarProd');
    editarButton.addEventListener('click', function (event) {
      event.preventDefault();

      hideAllSections(); // Hides all sections
      showSection('editarProdutos'); // Shows the editProducts section
    });

    // Generic function to show a section
    function showSection(targetId) {
      hideAllSections();
      const section = document.getElementById(targetId);
      if (section) {
        section.classList.remove('hidden');
      }
    }

    // Function to create a user card
    function createUserCard(user) {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
            <div>
                <h1>${user.nome}</h1>
                <h4>${user.email}</h4>
                <h2>${user.cargo}</h2>
                <span>${user.dataDeCriacao}</span>
                <button type="button" title="perfil">View Profile</button>
            </div>
        `;
      const button = card.querySelector('button');
      button.addEventListener('click', () => {
        window.location.href = `perfil-utilizador.html?id=${user.id}`;
      });
      return card;
    }

    // Function to add user cards to the container in the dashboard
    function displayUserCards(users) {
      const container = document.getElementById('userCardsContainer');
      container.innerHTML = ''; // Clears the container

      users.forEach(user => {
        const card = createUserCard(user);
        container.appendChild(card);
      });
    }

    // Function to load users from the backend
    async function loadUsers() {
      try {
        console.log('loadUsers function called');
        allUsers = await getTotalUsers(); // Uses the getTotalUsers function to get all users
        console.log('Users obtained:', allUsers);
        if (!Array.isArray(allUsers)) {
          throw new Error('Unexpected data format');
        }
        currentPage = 1; // Reset to the first page when loading users
        displayUsersTable(getUsersForPage(currentPage)); // Calls the function to display the user table
        displayPaginationButtons(); // Displays the pagination buttons
      } catch (error) {
        console.error('Error:', error);
      }
    }

    // Function to get users for the current page
    function getUsersForPage(page) {
      const startIndex = (page - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      return allUsers.slice(startIndex, endIndex);
    }

    // Function to display users in a table
    function displayUsersTable(users) {
      console.log('displayUsersTable function called');
      console.log('User data:', users);
      const container = document.getElementById('tabelaUtilizadores');
      console.log('User table container:', container);
      container.innerHTML = '';

      const table = document.createElement('table');
      table.innerHTML = `
                <thead>
                  <tr>
                    <th style="text-align: center;">Username</th>
                    <th style="text-align: center;">Email</th>
                    <th style="text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${users
                    .map(
                      user => `
                    <tr class="${user.suspended ? 'suspended-user' : ''}">
                      <td style="text-align: center;">${user.username}</td>
                      <td style="text-align: center;">${user.email}</td>
                      <td style="text-align: center;">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                          <button class="btn-card tabela-btn btn-danger redirect-user" data-user-id="${user.id}">View Profile</button>
                          <button class="btn-card tabela-btn ${
                            user.suspended ? 'btn-success' : 'btn-info'
                          } suspend-user" data-user-id="${user.id}">${
                        user.suspended ? 'Reactivate' : 'Delete'
                      }</button>
                          <button class="btn-card tabela-btn btn-edit" data-username="${user.username}">Exclude</button>
                        </div>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              `;
      console.log('Table created:', table);
      container.appendChild(table);
      console.log('Table added to container');

      // Adds event listeners for the "View Profile" buttons
      const redirectUserButtons = table.querySelectorAll('.redirect-user');
      redirectUserButtons.forEach(button => {
        button.addEventListener('click', function () {
          const userId = this.dataset.userId;
          console.log(
            `Redirect to user profile with ID: ${userId}`
          );
          // Redirect to the user profile page
          window.location.href = `http://localhost:8080/frontend/perfil-utilizador.html?id=${userId}`;
        });
      });

      // Adds event listeners for the "Delete/Reactivate" buttons
      const suspendUserButtons = table.querySelectorAll('.suspend-user');
      suspendUserButtons.forEach(button => {
        button.addEventListener('click', async function () {
          const userId = this.dataset.userId;
          const isSuspended = this.classList.contains('btn-success'); // Checks if the button has the class 'btn-success'

          if (isSuspended) {
            // Reactivate user
            console.log(`Request to reactivate user with ID: ${userId}`);
            try {
              await reactivateUser(userId);
              console.log(`User with ID ${userId} reactivated successfully`);
              alert('User reactivated successfully!');
              loadUsers(); // Reload the user list
            } catch (error) {
              console.error('Error reactivating user:', error);
              alert('Error reactivating user. See console for details.');
            }
          } else {
            // Suspend user
            console.log(`Request confirmation to suspend user with ID: ${userId}`);
            showConfirmationModal(userId); // Show confirmation modal
          }
        });
      });
    }

    // Function to display the confirmation modal
    function showConfirmationModal(userId) {
      const modal = document.getElementById('confirmationModal');
      const confirmButton = document.getElementById('confirmButton');
      const cancelButton = document.getElementById('cancelButton');

      // Show the modal
      modal.style.display = 'block';

      // Add event listeners to the modal buttons
      confirmButton.onclick = async function () {
        console.log(
          `Confirmation received. Suspend user with ID: ${userId}`
        );
        try {
          await suspendUser(userId);
          console.log(`User with ID ${userId} suspended successfully`);
          // Show success alert
          alert('User suspended successfully!');
          // Reload the user list after suspension
          loadUsers();
        } catch (error) {
          console.error('Error suspending user:', error);
          // Handle the error as needed
        } finally {
          // Close the modal
          modal.style.display = 'none';
        }
      };

      cancelButton.onclick = function () {
        console.log('Suspension operation cancelled');
        // Close the modal
        modal.style.display = 'none';
      };
    }

    // Function to display the pagination buttons
    function displayPaginationButtons() {
      const totalPages = Math.ceil(allUsers.length / USERS_PER_PAGE);
      const container = document.getElementById('tabelaUtilizadores');

      // Check if pagination buttons already exist
      let paginationButtonsExist = false;
      if (container.querySelector('.pagination-button')) {
        paginationButtonsExist = true;
      }

      if (!paginationButtonsExist) {
        // Create pagination buttons
        for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = i;
          button.className = 'btn-card pagination-button'; // Add the 'btn-card' class
          button.addEventListener('click', () => {
            currentPage = i;
            displayUsersTable(getUsersForPage(currentPage));
            updateActiveButton(i); // Update the active button
          });
          container.appendChild(button);
        }
      }

      // Mark the current page button as active
      updateActiveButton(currentPage);
    }

    // Function to update the active button
    function updateActiveButton(activePage) {
      const container = document.getElementById('tabelaUtilizadores');
      const buttons = container.querySelectorAll('.pagination-button');
      buttons.forEach(button => {
        button.classList.remove('active'); // Remove the 'active' class from all buttons
        if (parseInt(button.textContent) === activePage) {
          button.classList.add('active'); // Add the 'active' class to the current page button
        }
      });
    }

    // Function to show user management buttons
    function showUserManagementButtons() {
      const userManagementButtons = document.querySelector(
        '.user-management-buttons'
      );
      if (userManagementButtons) {
        userManagementButtons.classList.remove('hidden');
      }
    }

    // Function to load the dashboard
    async function loadDashboard() {
      try {
        const users = await getTotalUsers();
        displayUserCards(users);
      } catch (error) {
        console.error('Error loading the dashboard:', error);
      }
    }
  } catch (error) {
    console.error('Error initializing the page:', error);
  }
}

// Wait for the DOM to load completely before running the initPage function
document.addEventListener('DOMContentLoaded', initPage);


/* Button for administrators to permanently delete inactive products */
/*
export function setupPermanentDeleteButton(productId) {
  const permDeleteBtn = document.getElementById('permanent-delete-product');
  
  if (permDeleteBtn) {
    permDeleteBtn.addEventListener('click', async () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      
      // Check if user is an admin
      if (!user || !user.isAdmin) {
        alert('Only administrators can permanently delete products.');
        return;
      }
      
      const confirmDelete = confirm(
        'Are you sure you want to PERMANENTLY delete this product? This action CANNOT be undone!'
      );

      if (confirmDelete) {
        try {
          // Show processing state
          permDeleteBtn.disabled = true;
          permDeleteBtn.innerHTML = 'Processing... <i class="fa fa-spinner fa-spin"></i>';
          
          // Call the permanent deletion endpoint
          await productAPI.permanentlyDeleteProduct(productId);
          
          alert('Product permanently deleted successfully.');
          window.location.href = 'admin-products.html'; // Troca por uma página que queiras redirecionar
        } catch (error) {
          console.error('Error permanently deleting product:', error);
          
          if (error.message.includes('not in inactive state')) {
            alert('This product must be deactivated before it can be permanently deleted.');
          } else {
            alert('An error occurred while trying to delete the product. Please try again.');
          }
          
          // Reset button
          permDeleteBtn.disabled = false;
          permDeleteBtn.innerHTML = 'Permanently Delete';
        }
      }
    });
  }
}
  */
