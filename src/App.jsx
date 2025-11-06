import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import VotePanel from './components/VotePanel';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [nim, setNim] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);
  const canVote = useMemo(() => Boolean(nim) && !hasVoted, [nim, hasVoted]);

  const handleLoginSuccess = ({ nim: nimValue, has_voted }) => {
    setNim(nimValue);
    setHasVoted(Boolean(has_voted));
    setLoginChecked(true);
    setActiveTab(Boolean(has_voted) ? 'results' : 'vote');
  };

  const handleVoteConfirm = () => {
    setHasVoted(true);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} canVote={canVote} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'login' && (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Secure, Anonymous, and Real‑Time Voting</h2>
              <p className="text-gray-700">
                Authenticate with your NIM to access the ballot. Your vote is counted instantly and never linked to your identity.
              </p>
              <ul className="text-gray-700 list-disc pl-5 space-y-1 text-sm">
                <li>One-person, one-vote validation</li>
                <li>Live results dashboard</li>
                <li>Admin panel for candidates and voter list</li>
              </ul>
            </div>
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        )}

        {activeTab === 'vote' && canVote && (
          <VotePanel nim={nim} onConfirm={handleVoteConfirm} />
        )}

        {activeTab === 'results' && (
          <ResultsPanel autoPoll={true} pollIntervalMs={4000} afterLoginChecked={loginChecked} />
        )}
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Universitas Nurtanio Bandung — Organizational Presidential Election
      </footer>
    </div>
  );
}

export default App;
