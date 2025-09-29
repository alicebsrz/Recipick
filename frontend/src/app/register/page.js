// frontend/src/app/register/page.js
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(email, password);
    
    if (result.success) {
      setSuccess(true);
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setError(result.error || 'Erro no registro');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans">
      <div className="p-10 bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-display font-bold mb-6 text-center text-foreground">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-foreground mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-foreground bg-white border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-foreground bg-white border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Conta criada com sucesso! Redirecionando para login...
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading || success}
            className="w-full bg-primary-green text-white font-bold p-3 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : success ? 'Success!' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}