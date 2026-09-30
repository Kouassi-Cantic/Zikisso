/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyDashboardPage } from './pages/MyDashboardPage';
import { WeekDetailPage } from './pages/WeekDetailPage';
import { FinalExamPage } from './pages/FinalExamPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AdminPage } from './pages/AdminPage';
import { CertificateVerificationPage } from './pages/CertificateVerificationPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <Routes>
            {/* Route protégée : Tableau de bord principal listant les semaines */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Route protégée : Mon tableau de bord personnel (notes, pondération, quiz, devoirs, progression) */}
            <Route
              path="/mon-tableau-de-bord"
              element={
                <ProtectedRoute>
                  <MyDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Route protégée : Ressources, Téléchargements PDF, Charte civique & Ambassadeurs */}
            <Route
              path="/ressources"
              element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              }
            />

            {/* Route protégée : Examen Final Général (Partie 1 QCM 12 questions + Partie 2 Étude de cas Guichet Unique) */}
            <Route
              path="/semaine/examen-final"
              element={
                <ProtectedRoute>
                  <FinalExamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/examen-final"
              element={
                <ProtectedRoute>
                  <FinalExamPage />
                </ProtectedRoute>
              }
            />

            {/* Route protégée : Page de détail d'une semaine / module */}
            <Route
              path="/semaine/:id"
              element={
                <ProtectedRoute>
                  <WeekDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Route protégée administrateur : Correction des soumissions */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Routes publiques d'authentification */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routes publiques de vérification officielle d'attestation */}
            <Route path="/verifier-certificat" element={<CertificateVerificationPage />} />
            <Route path="/verifier-certificat/:code" element={<CertificateVerificationPage />} />

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}
