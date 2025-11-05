
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Page, User, Role } from '../types';

interface AuthScreenProps {
  isLogin: boolean;
  onSwitch: () => void;
  onNavigate: (page: Page) => void;
}

const GoogleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ isLogin, onSwitch, onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: '1',
      name: isLogin ? 'Demo User' : name,
      email: email,
      role: Role.Owner,
    };
    login(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 onClick={() => onNavigate(Page.Landing)} className="text-4xl font-display text-text-primary cursor-pointer">AetherDial</h1>
          <h2 className="text-2xl font-semibold text-text-primary mt-4">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="text-text-secondary mt-2">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={onSwitch} className="font-semibold text-primary hover:text-primary-hover ml-2">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-8">
          <button className="w-full flex items-center justify-center py-2.5 px-4 border border-border rounded-md hover:bg-border transition mb-6">
            <GoogleIcon className="w-5 h-5" />
            <span className="ml-3 font-medium text-sm text-text-primary">Sign {isLogin ? 'in' : 'up'} with Google</span>
          </button>
          
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-xs text-text-secondary uppercase">Or continue with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-md transition">
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
