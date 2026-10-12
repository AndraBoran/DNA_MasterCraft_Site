import { useState } from 'react';
import { api } from '../services/api';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [authView, setAuthView] = useState('none'); // 'none' | 'login' | 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authMsg, setAuthMsg] = useState({ type: '', text: '' });

  const openAuth = (view, errorMsg = '') => {
    setAuthView(view);
    setAuthMsg(errorMsg ? { type: 'error', text: errorMsg } : { type: '', text: '' });
  };

  const closeAuth = () => {
    setAuthView('none');
    setAuthMsg({ type: '', text: '' });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthMsg({ type: '', text: '' });

    try {
      if (authView === 'login') {
        const res = await api.login({ email: authForm.email, password: authForm.password });
        if (res.status === 'success') {
          setCurrentUser(res.user);
          localStorage.setItem('user_session', JSON.stringify(res.user));
          closeAuth();
          setAuthForm({ name: '', email: '', password: '' });
        } else {
          setAuthMsg({ type: 'error', text: res.message || 'Credențiale invalide!' });
        }
      } else {
        const res = await api.register(authForm);
        if (res.status === 'success') {
          setAuthMsg({ type: 'success', text: 'Cont creat cu succes! Te poți autentifica.' });
          setAuthView('login');
        } else {
          setAuthMsg({ type: 'error', text: res.message || 'Eroare la crearea contului.' });
        }
      }
    } catch {
      setAuthMsg({ type: 'error', text: 'Eroare de comunicare cu serverul.' });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_session');
  };

  return {
    currentUser,
    authView,
    authForm,
    setAuthForm,
    authMsg,
    openAuth,
    closeAuth,
    setAuthView,
    handleAuthSubmit,
    logout
  };
}