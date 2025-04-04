import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import ProfileEditForm from './ProfileEditForm';
import userEvent from '@testing-library/user-event';

// Mock dos hooks e APIs necessários
jest.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({ setCurrentUser: jest.fn() })
}));
jest.mock('../../hooks/useFormInput', () => ({
    useFormInput: () => [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        jest.fn(),
        jest.fn()
    ]
}));
jest.mock('../../api/userAPI', () => ({
    userAPI: { updateUser: jest.fn() }
}));

// Teste para renderizar o formulário de edição de perfil
test('renderiza campos do formulário com dados do usuário', () => {
    render(<ProfileEditForm user={{ firstName: 'John', lastName: 'Doe', email: 'john@example.com' }} />);

    expect(screen.getByLabelText(/Nome:/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Apelido:/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/Email:/i)).toHaveValue('john@example.com');
});

// Teste para alternar entre modo de edição e visualização
test('alterna entre modo de edição e visualização', () => {
    render(<ProfileEditForm user={{ firstName: 'John', lastName: 'Doe', email: 'john@example.com' }} />);

    // Inicialmente os campos devem estar em modo somente leitura
    expect(screen.getByLabelText(/Nome:/i)).toHaveAttribute('readonly');
    expect(screen.getByLabelText(/Apelido:/i)).toHaveAttribute('readonly');
    expect(screen.getByLabelText(/Email:/i)).toHaveAttribute('readonly');

    // Clique no botão "Editar Perfil"
    fireEvent.click(screen.getByText(/Editar Perfil/i));

    // Agora os campos devem ser editáveis
    expect(screen.getByLabelText(/Nome:/i)).not.toHaveAttribute('readonly');
    expect(screen.getByLabelText(/Apelido:/i)).not.toHaveAttribute('readonly');
    expect(screen.getByLabelText(/Email:/i)).not.toHaveAttribute('readonly');
});
  
