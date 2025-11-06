import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function VotePanel({ nim, onConfirm }) {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/candidates`);
        if (!res.ok) throw new Error('Failed to load candidates');
        const data = await res.json();
        if (isMounted) setCandidates(data);
      } catch (e) {
        if (isMounted) setError(e.message || 'Error loading candidates');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selected) {
      setError('Please select a candidate pair to continue.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${BACKEND_URL}/api/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim, candidate_id: selected })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to submit vote');
      }
      onConfirm();
    } catch (e) {
      setError(e.message || 'An error occurred while submitting your vote');
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = useMemo(() => submitting || loading, [submitting, loading]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto"><p className="text-gray-600">Loading candidates…</p></div>
    );
  }

  if (error && candidates.length === 0) {
    return (
      <div className="max-w-5xl mx-auto"><p className="text-red-600">{error}</p></div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Ballot</h2>
        <p className="text-sm text-gray-600">Authenticated as NIM: <span className="font-medium text-gray-800">{nim}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {candidates.map((c) => (
          <label key={c._id} className={`group relative border rounded-xl overflow-hidden bg-white cursor-pointer transition shadow-sm hover:shadow-md ${selected === c._id ? 'ring-2 ring-blue-600' : 'border-gray-200'}`}>
            <input
              type="radio"
              name="candidate"
              value={c._id}
              checked={selected === c._id}
              onChange={() => setSelected(c._id)}
              className="hidden"
            />
            {c.photo_url && (
              <img src={c.photo_url} alt={`${c.president_name} & ${c.vice_name}`} className="h-44 w-full object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.president_name} & {c.vice_name}</h3>
                  {c.vision && <p className="text-sm text-gray-600">{c.vision}</p>}
                </div>
                {selected === c._id && <CheckCircle2 className="text-blue-600" />}
              </div>
            </div>
          </label>
        ))}

        <div className="md:col-span-2">
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Vote'}
          </button>
          <p className="mt-2 text-xs text-gray-500">After submission, your NIM will be marked as voted. Your choice remains anonymous.</p>
        </div>
      </form>
    </div>
  );
}
