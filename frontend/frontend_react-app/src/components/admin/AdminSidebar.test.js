import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

test('AdminSidebar renderiza todos os links corretamente', () => {
  render(
    <BrowserRouter>
      <AdminSidebar />
    </BrowserRouter>
  );

  expect(screen.getByText('Gestão de Avaliações')).toBeInTheDocument();
  expect(screen.getByText('Gestão de Produtos')).toBeInTheDocument();
  expect(screen.getByText('Gestão de Utilizadores')).toBeInTheDocument();

  expect(screen.getByText('Gestão de Avaliações').closest('a')).toHaveAttribute('href', '/admin/avaliacoes');
  expect(screen.getByText('Gestão de Produtos').closest('a')).toHaveAttribute('href', '/admin/produtos');
  expect(screen.getByText('Gestão de Utilizadores').closest('a')).toHaveAttribute('href', '/admin/utilizadores');
});
