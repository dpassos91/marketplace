'use strict';

import { loadCommonElements } from './loadCommons.js';
import * as productComponent from './components/product.js';
import * as userComponent from './components/user.js';

init();

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonElements();

    // Route handling based on the current page
    if (window.location.pathname.endsWith('index.html')) {
      await productComponent.displayMostRecentProducts();
      await productComponent.displayMostRatedProducts();
    }

    if (window.location.pathname.endsWith('pagina-login.html')) {
      document
        .getElementById('submitLoginForm')
        .addEventListener('click', userComponent.submitLoginForm);
      document
        .getElementById('login-form')
        .addEventListener('keypress', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            userComponent.submitLoginForm();
          }
        });
    }

    if (window.location.pathname.endsWith('produto-total.html')) {
      await productComponent.displayAllProducts();
    }

    if (window.location.pathname.endsWith('detalhes-produto.html')) {
      await productComponent.gerarDetalhesDoProduto();
    }

    if (window.location.pathname.endsWith('perfil-utilizador.html')) {
      await userComponent.displayUser();
      await userComponent.toggleFormUserEdit();
    }

    if (window.location.pathname.endsWith('novo-registo.html')) {
      await userComponent.addNewUser();
    }
  });
}
