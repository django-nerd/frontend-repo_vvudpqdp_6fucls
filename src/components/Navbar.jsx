import React, { useEffect, useMemo, useState } from 'react';

const Navbar = ({ currentUser, setCurrentUser, onScrollToBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Forms
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [logForm, setLogForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helpers to interact with localStorage
  const users = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('carease_users') || '{}');
    } catch {
      return {};
    }
  }, [isOpen]);

  const saveUsers = (obj) => localStorage.setItem('carease_users', JSON.stringify(obj));

  useEffect(() => {
    // Restore session
    try {
      const session = JSON.parse(localStorage.getItem('carease_session') || 'null');
      if (session) setCurrentUser(session);
    } catch {
      // ignore
    }
  }, [setCurrentUser]);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { name, email, phone, password } = regForm;
    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (users[email]) {
      setError('An account with this email already exists.');
      return;
    }
    const updated = { ...users, [email]: { name, email, phone, password, bookings: [] } };
    saveUsers(updated);
    setSuccess('Registration successful! You can now log in.');
    setMode('login');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { email, password } = logForm;
    const user = users[email];
    if (!user || user.password !== password) {
      setError('Invalid email or password.');
      return;
    }
    const session = { name: user.name, email: user.email };
    localStorage.setItem('carease_session', JSON.stringify(session));
    setCurrentUser(session);
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('carease_session');
    setCurrentUser(null);
  };

  const NavLink = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="text-slate-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
    >
      {children}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">CarEase</span>
        </div>
        <div className="flex items-center space-x-1">
          <NavLink onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</NavLink>
          <NavLink onClick={onScrollToBooking}>Book Ride</NavLink>
          <NavLink onClick={() => {
            const footer = document.getElementById('contact');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
          }}>Contact</NavLink>
          {!currentUser ? (
            <button
              onClick={() => { setMode('login'); setIsOpen(true); }}
              className="ml-2 inline-flex items-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 shadow"
            >
              Login / Register
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                Welcome {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal>
          <div className="w-full sm:max-w-lg max-w-md rounded-xl bg-white shadow-xl overflow-hidden">
            <div className="flex">
              <button
                className={`flex-1 py-3 font-medium ${mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 font-medium ${mode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                onClick={() => setMode('register')}
              >
                Register
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              {mode === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button type="button" className="px-4 py-2 text-slate-600" onClick={() => setIsOpen(false)}>Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Account</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={logForm.email}
                      onChange={(e) => setLogForm({ ...logForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={logForm.password}
                      onChange={(e) => setLogForm({ ...logForm, password: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button type="button" className="px-4 py-2 text-slate-600" onClick={() => setIsOpen(false)}>Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Log In</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
