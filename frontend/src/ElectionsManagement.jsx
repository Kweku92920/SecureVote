import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import ElectionCard from '../components/ElectionCard';
import CreateElectionModal from '../components/CreateElectionModal';
import { api, formatDateRange } from '../lib/api';
import { useConfirm } from '../context/ConfirmContext';

// ---------------------------------------------------------------------------
// Clean Professional Light Theme (Consistent with Dashboard, Settings & Candidates)
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

const nextStatus = {
  active: 'paused',
  paused: 'ended',
  ended: 'active',
  draft: 'active',
};

const STATUS_META = {
  all: { label: 'All', dot: '#0F172A' },
  active: { label: 'Active', dot: '#059669' },
  paused: { label: 'Paused', dot: '#D97706' },
  ended: { label: 'Ended', dot: '#475569' },
  draft: { label: 'Draft', dot: '#2563EB' },
};

const EMPTY_COPY = {
  all: {
    heading: 'No elections yet',
    body: 'Elections you create will be recorded here.',
  },
  active: { heading: 'Nothing active right now', body: 'Elections currently open for voting will appear here.' },
  paused: { heading: 'No paused elections', body: 'Elections you pause will be held here until resumed.' },
  ended: { heading: 'No elections have ended', body: 'Closed elections and their final tallies will appear here.' },
  draft: { heading: 'No drafts saved', body: 'Unpublished elections you’re still setting up will appear here.' },
};

const ElectionsManagement = () => {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [electionsDataset, setElectionsDataset] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const confirm = useConfirm();

  const loadElections = async () => {
    try {
      setIsLoading(true);
      setElectionsDataset(await api.get('/elections'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const filterTabs = ['all', 'active', 'paused', 'ended', 'draft'];

  const tabCounts = useMemo(() => {
    const counts = { all: electionsDataset.length, active: 0, paused: 0, ended: 0, draft: 0 };
    electionsDataset.forEach((item) => {
      if (counts[item.status] !== undefined) counts[item.status] += 1;
    });
    return counts;
  }, [electionsDataset]);

  const filteredDataList = useMemo(() => {
    return currentFilter === 'all'
      ? electionsDataset
      : electionsDataset.filter(item => item.status === currentFilter);
  }, [currentFilter, electionsDataset]);

  const handleCreateElection = async (newElection) => {
    try {
      const created = await api.post('/elections', newElection);
      setElectionsDataset((current) => [created, ...current]);
      toast.success('Election created.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (election) => {
    try {
      const updated = await api.patch(`/elections/${election.id}/status`, { status: nextStatus[election.status] });
      setElectionsDataset((current) => current.map((item) => item.id === updated.id ? updated : item));
      toast.success(`Election marked ${updated.status}.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (electionId) => {
    const shouldDelete = await confirm({
      title: 'Delete election?',
      message: 'This will permanently delete the election and all votes connected to it. Do you want to continue?',
      confirmText: 'Delete Election',
      cancelText: 'Keep Election',
    });
    if (!shouldDelete) return;
    try {
      await api.delete(`/elections/${electionId}`);
      setElectionsDataset((current) => current.filter((item) => item.id !== electionId));
      toast.success('Election deleted.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const emptyCopy = EMPTY_COPY[currentFilter] ?? EMPTY_COPY.all;

  return (
    <div className="space-y-8 text-left p-6 sm:p-8 min-h-screen" style={{ background: palette.ink, color: palette.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-6 pb-6" style={{ borderBottom: `1px solid ${palette.hairline}` }}>
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg font-semibold shadow-sm"
            style={{ background: palette.primarySoft, color: palette.primary, border: `1px solid ${palette.primaryBorder}` }}
          >
            <span className="text-base font-bold">E</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.primary, fontFamily: "'IBM Plex Mono', monospace" }}>
              Election Registry
            </p>
            <h2 className="mt-0.5 text-3xl font-semibold tracking-tight" style={{ color: palette.text }}>
              Elections
            </h2>
            <p className="mt-1 text-sm font-medium" style={{ color: palette.textMuted }}>
              Create, publish, and oversee every election on record.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-none items-center gap-2 rounded-md px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition-colors"
          style={{ background: palette.primary }}
        >
          <svg className="h-3.5 w-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Election
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-6 overflow-x-auto text-left" style={{ borderBottom: `1px solid ${palette.hairline}` }}>
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setCurrentFilter(tab)}
              className={`relative flex items-center gap-1.5 pb-3 pt-1 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                isActive ? '' : 'hover:opacity-80'
              }`}
              style={{ color: isActive ? palette.text : palette.textMuted }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: STATUS_META[tab].dot }}
              />
              {STATUS_META[tab].label}
              <span
                className="text-[11px]"
                style={{ color: palette.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {tabCounts[tab]}
              </span>
              {isActive && (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px]" style={{ backgroundColor: palette.primary }} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="rounded-md shadow-sm p-14 text-center text-[13px] font-medium" style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, color: palette.textFaint }}>
          Loading elections…
        </div>
      ) : filteredDataList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDataList.map((election) => (
            <ElectionCard
              key={election.id}
              title={election.title}
              dateRange={formatDateRange(election.startTime, election.endTime)}
              description={election.description}
              candidates={election.candidatesCount}
              votes={election.votes}
              status={election.status}
              onStatusChange={() => handleStatusChange(election)}
              onDelete={() => handleDelete(election.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md px-8 py-14 text-center shadow-sm" style={{ background: palette.panel, border: `1px dashed ${palette.hairline}` }}>
          <p className="text-base font-semibold" style={{ color: palette.text }}>
            {emptyCopy.heading}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm" style={{ color: palette.textMuted }}>{emptyCopy.body}</p>
          {currentFilter === 'all' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 rounded-md px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors shadow-sm"
              style={{ background: palette.primary, color: '#FFFFFF' }}
            >
              New Election
            </button>
          )}
        </div>
      )}

      <CreateElectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateElection}
      />
    </div>
  );
};

export default ElectionsManagement;