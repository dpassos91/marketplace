export function getAuthToken() {
  return sessionStorage.getItem('authToken');
}

export function setAuthToken(token) {
  sessionStorage.setItem('authToken', token);
}

export function removeAuthToken() {
  sessionStorage.removeItem('authToken');
  console.log('Token removed');
}

export function isAuthenticated() {
  return !!getAuthToken();
}

export function getCurrentUser() {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

export function setCurrentUser(userData) {
  sessionStorage.setItem('user', JSON.stringify(userData));
}

export function removeCurrentUser() {
  sessionStorage.removeItem('user');
  console.log('User removed');
}

export function logout() {
  removeAuthToken();
  removeCurrentUser();
}
