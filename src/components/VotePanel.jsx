import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const demoCandidates = [
  {
    id: 'pair-1',
    president: 'Candidate A',
    vice: 'Candidate A (Vice)',
    vision: 'Inclusive leadership, academic excellence, and student welfare.',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop',
  },
  {
    id: 'pair-2',
    president: 'Candidate B',
    vice: 'Candidate B (Vice)',
    vision: 'Innovation, transparency, and campus community engagement.',
    photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=700&auto=format&fit=crop',
  },
];

export default function VotePanel({ nim, onConfirm }) {
  const [selected, setSelected] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selected) {
      setError('Please select a candidate pair to continue.');
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 700));
      onConfirm({ nim, choice: selected });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Ballot</h2>
        <p className="text-sm text-gray-600">Authenticated as NIM: <span className="font-medium text-gray-800">{nim}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {demoCandidates.map((c) => (
          <label key={c.id} className={`group relative border rounded-xl overflow-hidden bg-white cursor-pointer transition shadow-sm hover:shadow-md ${selected === c.id ? 'ring-2 ring-blue-600' : 'border-gray-200'}`}>
            <input
              type="radio"
              name="candidate"
              value={c.id}
              checked={selected === c.id}
              onChange={() => setSelected(c.id)}
              className="hidden"
            />
            <img src={c.photo} alt={`${c.president} & ${c.vice}`} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{c.president} & {c.vice}</h3>
                  <p className="text-sm text-gray-600">{c.vision}</p>
                </div>
                {selected === c.id && <CheckCircle2 className="text-blue-600" />}
              </div>
            </div>
          </label>
        ))}

        <div className="md:col-span-2">
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
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
