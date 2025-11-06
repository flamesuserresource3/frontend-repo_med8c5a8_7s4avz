import React from 'react';
import { Shield, BarChart3, UserCheck } from 'lucide-react';

const tabs = [
  { key: 'login', label: 'Voter Login', icon: UserCheck },
  { key: 'vote', label: 'Vote', icon: Shield },
  { key: 'results', label: 'Live Results', icon: BarChart3 },
];

export default function Header({ activeTab, setActiveTab, canVote }) {
  return (
    <header className="w-full bg-white/70 backdrop-blur border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold leading-tight">UNB Presidential Election</h1>
            <p className="text-xs text-gray-500">Universitas Nurtanio Bandung</p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {tabs.map(({ key, label, icon: Icon }) => {
            const disabled = key === 'vote' && !canVote;
            return (
              <button
                key={key}
                onClick={() => !disabled && setActiveTab(key)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors border ${
                  activeTab === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={disabled}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
