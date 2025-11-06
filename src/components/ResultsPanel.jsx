import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

function ResultBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-gray-600">{value} • {pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ResultsPanel({ autoPoll = false, pollIntervalMs = 5000, afterLoginChecked = false }) {
  const [results, setResults] = useState({ total: 0, per_candidate: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/results`);
      if (!res.ok) throw new Error('Failed to fetch results');
      const data = await res.json();
      setResults(data);
      setError('');
    } catch (e) {
      setError(e.message || 'Error fetching results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoPoll || afterLoginChecked) {
      fetchResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoginChecked]);

  useEffect(() => {
    if (!autoPoll) return;
    timerRef.current = setInterval(fetchResults, pollIntervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPoll, pollIntervalMs]);

  const total = results.total || 0;

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          <h2 className="text-lg font-semibold">Live Results</h2>
        </div>
        <button
          onClick={fetchResults}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">Real-time vote counts and percentages update as ballots are submitted.</p>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {loading && <p className="text-gray-600">Loading…</p>}
      <div className="space-y-4">
        {results.per_candidate && results.per_candidate.length > 0 ? (
          results.per_candidate.map((c, idx) => (
            <ResultBar key={c.candidate_id || idx} label={c.name || `Candidate ${idx + 1}`} value={c.count || 0} total={total} color={idx % 2 === 0 ? 'bg-blue-600' : 'bg-emerald-500'} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No results yet.</p>
        )}
      </div>
      <p className="mt-4 text-xs text-gray-500">Public visibility can be configured by administrators.</p>
    </div>
  );
}
