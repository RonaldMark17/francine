import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogOut, 
  MapPin,
  Receipt,
  Truck,
  ArrowRight,
  Package
} from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login, 
    register, 
    currentUser,
    logout,
    orders = [],
    navigateTo
  } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
    affiliation: ''
  });

  // Sync isRegister tab with external authModalMode when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setIsRegister(authModalMode === 'register');
      setErrorMsg('');
      setShowPassword(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isAuthModalOpen, setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regData.name.trim() || !regData.email.trim() || !regData.password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (regData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await register(regData);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthModalOpen(false);
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="relative bg-white max-w-lg w-full border border-neutral-300 shadow-2xl overflow-hidden my-6 animate-modal-pop max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF9F5] border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-black" />
            <span className="text-xs font-light font-editorial uppercase tracking-[0.2em] text-black">
              {currentUser ? 'My Account' : isRegister ? 'Create Account' : 'Sign In'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* If already logged in, show profile card */}
          {currentUser ? (
            <div className="space-y-6">
              <div className="bg-[#FAF9F5] border border-neutral-300 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-editorial text-lg">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm">{currentUser.name}</h3>
                      <p className="text-xs text-neutral-500 font-mono">{currentUser.email}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold border ${
                    currentUser.role === 'admin'
                      ? 'bg-black text-white border-black'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}>
                    {currentUser.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'BUYER'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block">Affiliation</span>
                    <span className="font-medium text-neutral-800">{currentUser.affiliation || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block">ID Reference</span>
                    <span className="font-mono text-neutral-800">{currentUser.idNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block">Phone</span>
                    <span className="font-medium text-neutral-800">{currentUser.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block">Member Since</span>
                    <span className="font-medium text-neutral-800">{currentUser.joinedDate || 'N/A'}</span>
                  </div>
                </div>

                {currentUser.savedAddress && (
                  <div className="pt-3 border-t border-neutral-200 text-xs">
                    <span className="text-[10px] uppercase text-neutral-400 block mb-1">Saved Address</span>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="text-neutral-700 font-light">{currentUser.savedAddress}</span>
                    </div>
                  </div>
                )}
              </div>



              <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 hover:underline font-medium flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleClose();
                      navigateTo('transactions');
                    }}
                    className="px-4 py-2 border border-neutral-300 text-black text-xs uppercase tracking-wider font-medium hover:border-black transition-colors"
                  >
                    All Transactions
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Login & Register Forms */
            <div className="space-y-6">
              
              {/* Tabs: Sign In / Create Account */}
              <div className="flex border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-3 text-xs uppercase tracking-wider font-medium border-b-2 text-center transition-all ${
                    !isRegister ? 'border-black text-black font-semibold' : 'border-transparent text-neutral-400 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-3 text-xs uppercase tracking-wider font-medium border-b-2 text-center transition-all ${
                    isRegister ? 'border-black text-black font-semibold' : 'border-transparent text-neutral-400 hover:text-black'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
                  <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SIGN IN FORM */}
              {!isRegister ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter email or username (e.g. admin)"
                        className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-9 pr-10 py-2.5 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Sign In to Account
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center font-light">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                      className="text-black underline font-medium"
                    >
                      Create one here
                    </button>
                  </p>
                </form>
              ) : (
                /* REGISTRATION FORM (Automatically Buyer) */
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Juan Dela Cruz"
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                        placeholder="0917-000-0000"
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Minimum 6 characters"
                        className="w-full px-3 py-2 pr-10 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">
                      School / Organization / Affiliation <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={regData.affiliation}
                      onChange={(e) => setRegData({ ...regData, affiliation: e.target.value })}
                      placeholder="e.g. University of Santo Tomas, St. Jude, or Company"
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Register Account
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center font-light">
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                      className="text-black underline font-medium"
                    >
                      Sign in instead
                    </button>
                  </p>
                </form>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
