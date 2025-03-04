'use strict';

import { addNewProduct } from './productComponent.js';

export async function addModalListeners() {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('openModalBtn');
  const span = document.getElementsByClassName('close')[0];
  const cancel = document.getElementById('newProductFormCancelBtn');
  const form = document.getElementById('form-novo-produto');

  btn.onclick = function () {
    modal.style.display = 'block';
    addNewProduct();
  };

  cancel.onclick = function () {
    modal.style.display = 'none';
    form.reset();
  };

  span.onclick = function () {
    modal.style.display = 'none';
    form.reset();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      form.reset();
    }
  };
}
