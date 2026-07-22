import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudyLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_STUDY_PASSWORD;

    if (!correctPassword) {
      setError('Study password not configured');
      return;
    }

    if (password === correctPassword) {
      localStorage.setItem('study-authenticated', 'true');
      navigate('/study/curriculum');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Hub</h1>
          <p className="text-gray-600 mb-6">Enter password to access</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
            </div>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Access Study Hub
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            This area requires authentication
          </p>
        </div>
      </div>
    </div>
  );
}
