import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.user?.id || decoded.id;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
};