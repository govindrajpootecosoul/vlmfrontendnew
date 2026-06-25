import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useRequireRole() {
  const navigate = useNavigate();
  const { selectedRole } = useAuth();
  const role = selectedRole || localStorage.getItem('vlm_role');

  useEffect(() => {
    if (!role) navigate('/role-selection', { replace: true });
  }, [role, navigate]);

  return role;
}
