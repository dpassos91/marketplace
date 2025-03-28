import { render, screen } from '@testing-library/react';
import ProfileInfo from './ProfileInfo';

test('renderiza campos de username e email', () => {
  render(
    <ProfileInfo 
      user={{ 
        username: 'TestUser', 
        email: 'test@example.com' 
      }} 
      isOwnProfile={true}
    />
  );
  
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
});

test('mostra botão de editar quando isOwnProfile é true', () => {
  render(
    <ProfileInfo 
      user={{ 
        username: 'TestUser', 
        email: 'test@example.com' 
      }} 
      isOwnProfile={true}
    />
  );
  
  expect(screen.getByText(/Editar Perfil/i)).toBeInTheDocument();
});

test('não mostra botão de editar quando isOwnProfile é false', () => {
  render(
    <ProfileInfo 
      user={{ 
        username: 'TestUser', 
        email: 'test@example.com' 
      }} 
      isOwnProfile={false}
    />
  );
  
  expect(screen.queryByText(/Editar Perfil/i)).not.toBeInTheDocument();
});

