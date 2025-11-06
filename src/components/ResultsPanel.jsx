import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';

// Simple inline chart bars without extra deps
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

export default function ResultsPanel({ liveData }) {
  const [data, setData] = useState(liveData || [
    { id: 'pair-1', name: 'Candidate A Pair', votes: 0 },
    { id: 'pair-2', name: 'Candidate B Pair', votes: 0 },
  ]);

  useEffect(() => {
    if (liveData) setData(liveData);
  }, [liveData]);

  const total = useMemo(() => data.reduce((s, d) => s + d.votes, 0), [data]);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="text-blue-600" />
        <h2 className="text-lg font-semibold">Live Results</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">Real-time vote counts and percentages update as ballots are submitted.</p>
      <div className="space-y-4">
        <ResultBar label={data[0].name} value={data[0].votes} total={total} color="bg-blue-600" />
        <ResultBar label={data[1].name} value={data[1].votes} total={total} color="bg-emerald-500" />
      </div>
      <p className="mt-4 text-xs text-gray-500">Public visibility can be configured by administrators.</p>
    </div>
  );
}
