import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({
  children,
  redirectTo = 'home',
  message = 'Please sign in to view this page.',
  openLogin = true
}) {
  const {
    currentUser,
    navigateTo,
    setAuthModalMode,
    setIsAuthModalOpen,
    showToast
  } = useApp();
  const handledUnauthorizedAccess = useRef(false);

  useEffect(() => {
    if (currentUser?.sessionToken || handledUnauthorizedAccess.current) return;

    handledUnauthorizedAccess.current = true;
    showToast(message, 'info');
    if (openLogin) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
    navigateTo(redirectTo);
  }, [currentUser, message, navigateTo, openLogin, redirectTo, setAuthModalMode, setIsAuthModalOpen, showToast]);

  if (!currentUser?.sessionToken) return null;

  return children;
}
