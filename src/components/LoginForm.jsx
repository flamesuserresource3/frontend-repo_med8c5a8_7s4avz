import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

export default function LoginForm({ onSuccess }) {
  const [nim, setNim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!nim.trim()) {
      setError('Please enter your NIM');
      return;
    }
    // In the full app, this will call the backend to validate the NIM.
    // Here we only simulate a quick client-side check for the demo UI.
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      // Simulate simple format check: numeric 8-12 digits
      if (!/^\d{8,12}$/.test(nim)) {
        setError('Invalid NIM format. Use digits only, 8-12 characters.');
        return;
      }
      onSuccess(nim.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound className="text-blue-600" />
        <h2 className="text-lg font-semibold">Voter Authentication</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Enter your Student Identification Number (NIM) to access the ballot. Only eligible, active voters can proceed.
      </p>
      <label className="text-sm font-medium text-gray-700">NIM</label>
      <input
        type="text"
        value={nim}
        onChange={(e) => setNim(e.target.value)}
        placeholder="e.g., 21123456"
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? 'Checking…' : 'Continue'}
      </button>
      <p className="mt-3 text-xs text-gray-500">
        Your identity is validated, but your vote remains anonymous. The system never stores a link between NIM and choice.
      </p>
    </form>
  );
}
