import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79]" />
        <p className="text-sm text-slate-600 font-medium">Vérification des habilitations administrateur...</p>
      </div>
    );
  }

  // Redirection si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirection stricte vers l'accueil si le rôle n'est pas "admin"
  if (userData?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
