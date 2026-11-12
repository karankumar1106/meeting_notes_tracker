import { useState } from 'react';
import { loginApi, registerApi } from '../services/api';

/**
 * AuthModal Component (Engineering Aesthetic)
 * 
 * Provides Sign In & Create Account workflows with clean validation,
 * error reporting, and loading states.
 */
function AuthModal({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (isRegister) {
        result = await registerApi(name, email, password);
      } else {
        result = await loginApi(email, password);
      }

      if (result.user) {
        onAuthSuccess(result.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mx-auto mb-3 text-zinc-200">
            <i className={`bi ${isRegister ? 'bi-person-plus' : 'bi-shield-lock'} text-lg`}></i>
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-zinc-400">
            {isRegister
              ? 'Sign up to start tracking your meeting commitments'
              : 'Sign in to access your meetings and action items'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <i className="bi bi-exclamation-circle shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Karan Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-sans"
                />
                <i className="bi bi-person absolute left-2.5 top-2 text-zinc-500 text-xs"></i>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-sans"
              />
              <i className="bi bi-envelope absolute left-2.5 top-2 text-zinc-500 text-xs"></i>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-9 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all font-sans"
              />
              <i className="bi bi-lock absolute left-2.5 top-2 text-zinc-500 text-xs"></i>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-white hover:text-zinc-200 transition-colors cursor-pointer flex items-center justify-center"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-white text-xs`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-zinc-800/80">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage(null);
                }}
                className="text-zinc-200 underline underline-offset-2 hover:text-white cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage(null);
                }}
                className="text-zinc-200 underline underline-offset-2 hover:text-white cursor-pointer"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;

