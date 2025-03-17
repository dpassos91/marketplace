import React, { useState } from 'react';

function NewProductModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    imageURL: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Produto submetido:', formData);
    // Adicione aqui a lógica para enviar os dados do formulário
    onClose(); // Fecha o modal após submissão
  };

  if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h1>Adicionar Novo Produto</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Introduza um título para o seu produto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Introduza a descrição do produto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {/* Substitua estas opções por categorias dinâmicas */}
              <option value="1">Eletrônicos</option>
              <option value="2">Roupas</option>
              <option value="3">Móveis</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Introduza o preço de venda"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageURL">URL da Imagem</label>
            <input
              type="text"
              id="imageURL"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              placeholder="Cole o link da imagem aqui"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Localização</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Em que zona do país é que se encontra?"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Submeter produto
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewProductModal;

