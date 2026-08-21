import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  X, 
  BookOpen, 
  FolderGit2, 
  History, 
  ChevronRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoClick = async () => {
    setIsDemoLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', authRequired: true },
    { name: 'Assessment', path: '/assessment', authRequired: true },
    { name: 'Roadmap', path: '/roadmap', authRequired: true },
    { name: 'Projects', path: '/projects', authRequired: true },
    { name: 'History', path: '/history', authRequired: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">CareerPath</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">STUDENT CAREER PLATFORM</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleDemoClick}
                  disabled={isDemoLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isDemoLoading ? 'Loading Demo...' : '1-Click Demo'}
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-600/20 flex items-center gap-1.5"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-850 border border-slate-800 hover:border-slate-700 text-sm text-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user?.name || 'Profile'}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Log out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={handleDemoClick}
                className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="pb-3 mb-2 border-b border-slate-850 flex items-center gap-2 text-sm text-slate-300">
                <User className="w-4 h-4 text-brand-400" />
                <span>Signed in as <strong className="text-white">{user?.name}</strong></span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-850"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
