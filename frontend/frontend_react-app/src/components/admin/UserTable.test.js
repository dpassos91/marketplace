import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserTable from './UserTable';

// Mock do hook useFetchUsers
jest.mock('../../hooks/useFetchUsers', () => () => ({
  users: [
    { id: 1, username: 'User1', email: 'user1@example.com', active: true },
  ],
  loading: false,
  error: null,
  refetch: jest.fn(),
}));

// Verificar se os dados da tabela são exibidos corretamente
test('renderiza a tabela de utilizadores corretamente', () => {
  render(<UserTable />);

  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('Ações')).toBeInTheDocument();
});

// Verificar se os dados do utilizador são exibidos corretamente
test('deve exibir os dados do utilizador corretamente', () => {
    render(<UserTable />);
  
    // Verificar se o username e o email do utilizador são renderizados
    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  // Verificar se os botões de ação são exibidos corretamente
  test('deve exibir o botão "Suspender" para usuários ativos', () => {
    render(<UserTable />);
  
    // Verificar se o botão "Suspender" está presente
    expect(screen.getByText('Suspender')).toBeInTheDocument();
  });
  
  test('não deve exibir o botão "Reativar" para usuários ativos', () => {
    render(<UserTable />);
  
    // Verificar se o botão "Reativar" não está presente
    expect(screen.queryByText('Reativar')).not.toBeInTheDocument();
  });

// Verificar se a função de redirecionamento é chamada ao clicar no botão "Consultar perfil"
test('deve chamar a função de redirecionamento ao clicar no botão "Consultar perfil"', () => {
    // Mockar o comportamento de redirecionamento do window.location.href
    const originalLocation = window.location;
    delete global.location;
    global.location = { href: '' };
  
    render(<UserTable />);
  
    // Encontrar o botão de "Consultar perfil"
    const consultButton = screen.getByText('Consultar perfil');
    
    // Simulando o clique no botão
    fireEvent.click(consultButton);
  
    // Verificar se o redirecionamento ocorre
    expect(global.location.href).toBe('http://localhost:3000/profile/1');
  
    // Restaurar o original location após o teste
    global.location = originalLocation;
  });    
  
  
  


