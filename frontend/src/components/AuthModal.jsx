import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function AuthModal() {
  const { showAuthModal, closeAuth, login, register, loading } = useContext(AuthContext);
  const [mode, setMode] = useState('login'); // or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!showAuthModal) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(email, password);
      if (!res.ok) alert(res.error || 'Login failed');
    } else {
      const res = await register(email, password, name);
      if (!res.ok) alert(res.error || 'Register failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{mode === 'login' ? 'Login' : 'Register'}</h3>
          <button onClick={closeAuth} className="text-gray-500">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded ${mode === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded ${mode === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded" disabled={loading}>
              {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
            </button>
            <button type="button" onClick={() => { setEmail(''); setPassword(''); setName(''); }} className="text-sm text-gray-500">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
