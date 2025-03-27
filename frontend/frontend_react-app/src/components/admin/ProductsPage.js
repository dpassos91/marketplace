import React from 'react';
import { Link } from 'react-router-dom';

function ProductsPage() {
  return (
    <div>
      <h2>Gestão de Produtos - Área Administrativa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/admin/produtos/inativos">
          <button className="btn-primary">Listar Produtos Inativos</button>
        </Link>
        <Link to="/admin/produtos/adicionar-categoria">
          <button className="btn-primary">Adicionar Categoria</button>
        </Link>
        <Link to="/admin/produtos/filtrar-categoria">
          <button className="btn-primary">Filtrar por Categoria</button>
        </Link>
        <Link to="/admin/produtos/filtrar-vendedor">
          <button className="btn-primary">Filtrar por Vendedor</button>
        </Link>
        {/* Adicione mais Links para outras funcionalidades */}
      </div>
    </div>
  );
}

export default ProductsPage;
