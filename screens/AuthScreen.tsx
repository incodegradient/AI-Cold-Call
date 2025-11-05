import React, { useState } from 'react';
import { Page } from '../types';
import { useAuth } from '../App';

interface AuthScreenProps {
  page: Page.Login | Page.Signup;
  onNavigate: (page: Page) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ page, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(page === Page.Login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (isLogin) {
      try {
        await login(email, password);
        // Navigation will happen in App.tsx context
      } catch (err) {
        setError('Invalid email or password. Try owner@example.com');
      }
    } else {
      // Signup logic would go here in a real app
      // For this demo, we'll just log in the demo user
      try {
        await login('owner@example.com', 'password');
      } catch (err) {
        setError('Could not sign up user.');
      }
    }
    setLoading(false);
  };
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    const newPage = isLogin ? Page.Signup : Page.Login;
    onNavigate(newPage);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-lg p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 onClick={() => onNavigate(Page.Landing)} className="text-3xl font-display cursor-pointer mb-2">AetherDial</h1>
          <h2 className="text-xl font-bold text-text-primary">{isLogin ? 'Log in to your account' : 'Create a new account'}</h2>
          <p className="text-text-secondary">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={toggleForm} className="font-semibold text-primary hover:text-primary-hover ml-1">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
