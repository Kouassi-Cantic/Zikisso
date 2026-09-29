import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1F4E79]" />
        <p className="text-sm text-slate-600 font-medium">Chargement de votre session MOOC...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Redirige vers /login en mémorisant l'URL d'origine
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
