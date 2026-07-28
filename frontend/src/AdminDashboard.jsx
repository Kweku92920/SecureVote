import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Vote,
  ShieldCheck,
  Users,
  ShieldAlert,
  PlusCircle,
  UserPlus,
  FileUp,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../lib/api';

// ---------------------------------------------------------------------------
// Clean Professional Light Theme (Consistent with Settings page)
// ---------------------------------------------------------------------------
const palette = {
  ink: '#FFFFFF',
  panel: '#F8FAFC',
  panelRaised: '#F1F5F9',
  hairline: '#E2E8F0',
  hairlineSoft: '#EDF2F7',
  text: '#0F172A',
  textMuted: '#475569',
  textFaint: '#94A3B8',
  primary: '#2563EB',
  primaryDim: '#1D4ED8',
  primarySoft: 'rgba(37,99,235,0.08)',
  primaryBorder: 'rgba(37,99,235,0.3)',
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .dash-root { font-family: 'Inter', sans-serif; background: ${palette.ink}; color: ${palette.text}; }
    .dash-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.04em; }
    .dash-eyebrow-rule { flex: 1; height: 1px; background: ${palette.hairline}; }
    .dash-row { transition: background 150ms ease, border-color 150ms ease; background: ${palette.panelRaised}; border: 1px solid ${palette.hairlineSoft}; }
    .dash-row:hover { background: #FFFFFF; border-color: ${palette.hairline}; }
    .dash-tile { transition: background 150ms ease, border-color 150ms ease, transform 150ms ease; background: ${palette.panel}; border: 1px solid ${palette.hairline}; }
    .dash-tile:hover { border-color: ${palette.primary}; background: ${palette.primarySoft}; }
    .dash-tile:active { transform: translateY(1px); }
    .dash-link { transition: gap 150ms ease; }
    .dash-link:hover { gap: 6px; }
  `}</style>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get('/dashboard')
      .then(setDashboard)
      .catch((error) => toast.error(error.message));
  }, []);

  const stats = useMemo(() => {
    const values = dashboard?.stats || {};
    return [
      {
        title: 'Active Elections', value: values.activeElections ?? 0, label: 'Active Elections',
        iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
        svgIcon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      },
      {
        title: 'Total Votes Cast', value: (values.totalVotes ?? 0).toLocaleString(), label: 'Total Votes Cast',
        iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
        svgIcon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        title: 'Registered Voters', value: values.registeredVoters ?? 0, label: 'Registered Voters',
        iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600',
        svgIcon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      },
      {
        title: 'Fraud Alerts', value: values.fraudAlerts ?? 0, label: 'Fraud Alerts',
        iconBg: 'bg-red-50', iconColor: 'text-red-600',
        svgIcon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      },
    ];
  }, [dashboard]);

  const activeElections = (dashboard?.elections || []).filter((election) => election.status === 'active').slice(0, 4);

  return (
    <div className="dash-root space-y-8 p-6 sm:p-8 min-h-screen">
      <GlobalStyle />

      {/* Header */}
      <div className="text-left pb-6" style={{ borderBottom: `1px solid ${palette.hairline}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="dash-mono text-[11px] uppercase font-semibold" style={{ color: palette.primary }}>Operations Overview</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: palette.text }}>Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: palette.textMuted }}>
          Election activity and system health, current as of your last sync.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Active elections */}
      <div
        className="rounded-lg p-6 text-left shadow-sm"
        style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4" style={{ color: palette.primary }} />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>Active Elections</h3>
          </div>
          <button
            onClick={() => navigate('/admin/elections')}
            className="dash-link dash-mono text-[11px] uppercase inline-flex items-center gap-1 font-medium"
            style={{ color: palette.primary }}
          >
            Manage elections
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {activeElections.length ? activeElections.map((election) => (
            <div
              key={election.id}
              className="dash-row p-4 rounded-md flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-semibold" style={{ color: palette.text }}>{election.title}</h4>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span
                    className="dash-mono text-[10px] uppercase px-2 py-0.5 rounded font-medium"
                    style={{ color: '#059669', background: '#ECFDF5', border: '1px solid rgba(5,150,105,0.3)' }}
                  >
                    {election.status}
                  </span>
                  <span className="dash-mono text-[11px]" style={{ color: palette.textFaint }}>
                    {election.votes.toLocaleString()} votes
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-sm font-medium py-6 text-center" style={{ color: palette.textFaint }}>
              No active elections yet.
            </p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div
        className="rounded-lg p-6 text-left shadow-sm"
        style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}
      >
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="w-4 h-4" style={{ color: palette.primary }} />
          <h3 className="text-sm font-semibold" style={{ color: palette.text }}>Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/admin/elections')}
            className="dash-tile flex flex-col items-start gap-3 p-4 rounded-md text-left"
          >
            <PlusCircle className="w-4 h-4" style={{ color: palette.primary }} />
            <span className="text-sm font-semibold" style={{ color: palette.text }}>New Election</span>
          </button>
          <button
            onClick={() => navigate('/admin/candidates')}
            className="dash-tile flex flex-col items-start gap-3 p-4 rounded-md text-left"
          >
            <UserPlus className="w-4 h-4" style={{ color: palette.primary }} />
            <span className="text-sm font-semibold" style={{ color: palette.text }}>Add Candidate</span>
          </button>
          <button
            onClick={() => navigate('/admin/voters')}
            className="dash-tile flex flex-col items-start gap-3 p-4 rounded-md text-left"
          >
            <FileUp className="w-4 h-4" style={{ color: palette.primary }} />
            <span className="text-sm font-semibold" style={{ color: palette.text }}>Import Voters</span>
          </button>
          <button
            onClick={() => navigate('/admin/results')}
            className="dash-tile flex flex-col items-start gap-3 p-4 rounded-md text-left"
          >
            <BarChart3 className="w-4 h-4" style={{ color: palette.primary }} />
            <span className="text-sm font-semibold" style={{ color: palette.text }}>View Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;