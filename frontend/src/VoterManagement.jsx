import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import VoterRow from '../components/VoterRow';
import AddVoterModal from '../components/AddVoterModal';
import ImportCsvModal from '../components/ImportCsvModal';
import { api } from '../lib/api';
import { useConfirm } from '../context/ConfirmContext';
import { useLanguage } from '../context/LanguageContext';

// ---------------------------------------------------------------------------
// Clean Professional Light Theme (Consistent with Dashboard, Settings, Candidates & Elections)
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
  verifiedText: '#059669',
  pendingText: '#D97706',
};

const VoterManagement = () => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddVoterOpen, setIsAddVoterOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoters, setSelectedVoters] = useState([]);
  const confirm = useConfirm();

  const loadVoters = async () => {
    try {
      setIsLoading(true);
      setVoters(await api.get('/voters'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVoters();
  }, []);

  const handleAddVoter = async (newVoter) => {
    try {
      const voter = await api.post('/voters', newVoter);
      setVoters((prev) => [voter, ...prev]);
      toast.success('Voter created with a secret code.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBulkImport = async (importedVoters) => {
    try {
      const created = await api.post('/voters/import', { voters: importedVoters });
      setVoters((prev) => [...created, ...prev.filter((oldVoter) => !created.some((newVoter) => newVoter.id === oldVoter.id))]);
      toast.success(`${created.length} voter records imported.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRegenerate = async (voterId) => {
    try {
      const updated = await api.patch(`/voters/${voterId}/regenerate`, {});
      setVoters((prev) => prev.map((voter) => voter.id === updated.id ? updated : voter));
      toast.success('Secret code regenerated.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (voterId) => {
    const shouldDelete = await confirm({
      title: 'Delete voter?',
      message: 'This will permanently delete the voter record and their access code. Do you want to continue?',
      confirmText: 'Delete Voter',
      cancelText: 'Keep Voter',
    });
    if (!shouldDelete) return;
    try {
      await api.delete(`/voters/${voterId}`);
      setVoters((prev) => prev.filter((voter) => voter.id !== voterId));
      setSelectedVoters((prev) => prev.filter((id) => id !== voterId));
      toast.success('Voter deleted.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const processedVoters = useMemo(() => {
    return voters.filter((voter) => {
      const matchesSearch = voter.name.toLowerCase().includes(searchQuery.toLowerCase()) || voter.phone.includes(searchQuery);
      const matchesTab = filterType === 'all' || voter.status.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [voters, searchQuery, filterType]);

  const toggleVoterSelection = (voterId) => {
    setSelectedVoters((current) =>
      current.includes(voterId) ? current.filter((id) => id !== voterId) : [...current, voterId]
    );
  };

  const toggleAllProcessed = () => {
    const processedIds = processedVoters.map((voter) => voter.id);
    const allSelected = processedIds.length > 0 && processedIds.every((id) => selectedVoters.includes(id));
    setSelectedVoters((current) => {
      if (allSelected) return current.filter((id) => !processedIds.includes(id));
      return Array.from(new Set([...current, ...processedIds]));
    });
  };

  const handleBulkDelete = async () => {
    const count = selectedVoters.length;
    if (!count) return;
    const shouldDelete = await confirm({
      title: 'Delete selected voters?',
      message: `This will permanently delete ${count} selected voter record${count === 1 ? '' : 's'}. Do you want to continue?`,
      confirmText: 'Delete Selected',
      cancelText: 'Keep Voters',
    });
    if (!shouldDelete) return;

    try {
      const result = await api.post('/voters/bulk-delete', { ids: selectedVoters });
      setVoters((prev) => prev.filter((voter) => !selectedVoters.includes(voter.id)));
      setSelectedVoters([]);
      toast.success(`${result.deleted} voter records deleted.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const metrics = useMemo(() => {
    return {
      total: voters.length,
      verified: voters.filter(v => v.status === 'Verified').length,
      pending: voters.filter(v => v.status === 'Pending').length
    };
  }, [voters]);

  return (
    <div className="space-y-6 text-left p-6 sm:p-8 min-h-screen" style={{ background: palette.ink, color: palette.text, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-6" style={{ borderBottom: `1px solid ${palette.hairline}` }}>
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg font-semibold shadow-sm"
            style={{ background: palette.primarySoft, color: palette.primary, border: `1px solid ${palette.primaryBorder}` }}
          >
            <span className="text-base font-bold">V</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.primary, fontFamily: "'IBM Plex Mono', monospace" }}>
              Voter Registry
            </p>
            <h2 className="mt-0.5 text-3xl font-semibold tracking-tight" style={{ color: palette.text }}>
              {t('voterManagement')}
            </h2>
            <p className="mt-1 text-sm font-medium" style={{ color: palette.textMuted }}>{t('manageVoterCredentials')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsImportCsvOpen(true)}
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold shadow-sm transition-colors"
            style={{ background: '#FFFFFF', border: `1px solid ${palette.hairline}`, color: palette.text }}
          >
            <svg className="h-4 w-4" style={{ color: palette.textMuted }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t('importCsv')}
          </button>
          <button
            onClick={() => setIsAddVoterOpen(true)}
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition-colors"
            style={{ background: palette.primary }}
          >
            <svg className="h-3.5 w-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {t('addVoter')}
          </button>
        </div>
      </div>

      {/* Tally strip */}
      <div className="grid grid-cols-1 divide-y rounded-md shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ background: palette.panel, border: `1px solid ${palette.hairline}`, borderColor: palette.hairline }}>
        <div className="px-6 py-4 text-left border-l-4" style={{ borderLeftColor: palette.primary }}>
          <p
            className="text-[26px] font-semibold leading-none"
            style={{ color: palette.text, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {metrics.total}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>{t('totalVoters')}</p>
        </div>

        <div className="px-6 py-4 text-left border-l-4" style={{ borderLeftColor: palette.verifiedText }}>
          <p
            className="text-[26px] font-semibold leading-none"
            style={{ color: palette.verifiedText, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {metrics.verified}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>{t('verified')}</p>
        </div>

        <div className="px-6 py-4 text-left border-l-4" style={{ borderLeftColor: palette.pendingText }}>
          <p
            className="text-[26px] font-semibold leading-none"
            style={{ color: palette.pendingText, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {metrics.pending}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>{t('pending')}</p>
        </div>
      </div>

      {/* Toolbar: Search and Filter Tabs */}
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-md p-4 shadow-sm md:flex-row md:items-center" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
        <div className="relative max-w-md flex-1 text-left">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg className="h-4 w-4" style={{ color: palette.textFaint }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchVoters')}
            className="w-full rounded-md px-4 py-2.5 pl-10 pr-4 text-sm shadow-sm transition-all outline-none"
            style={{ background: '#FFFFFF', border: `1px solid ${palette.hairline}`, color: palette.text }}
          />
        </div>
        <div className="flex items-center gap-6 pt-3 md:pt-0" style={{ borderTop: `1px solid ${palette.hairline}`, md: { borderTop: 'none' } }}>
          {['all', 'verified', 'pending'].map((type) => {
            const isActive = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`relative pb-1 text-[13px] font-semibold capitalize transition-colors ${
                  isActive ? '' : 'hover:opacity-80'
                }`}
                style={{ color: isActive ? palette.text : palette.textMuted }}
              >
                {type}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-[2px]" style={{ backgroundColor: palette.primary }} aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Context Bar */}
      {selectedVoters.length > 0 && (
        <div className="flex items-center justify-between rounded-md px-5 py-3.5 text-left shadow-sm" style={{ background: palette.text, color: palette.ink }}>
          <p
            className="text-[13px] font-semibold"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {selectedVoters.length} {t('selectedVoters')}
          </p>
          <button
            onClick={handleBulkDelete}
            className="rounded-md border border-white/30 px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-white/10"
          >
            {t('deleteSelected')}
          </button>
        </div>
      )}

      {/* Data Table Container */}
      <div className="overflow-hidden rounded-md shadow-sm" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ background: palette.panelRaised, color: palette.textMuted, borderBottom: `1px solid ${palette.hairline}`, fontFamily: "'IBM Plex Mono', monospace" }}>
                <th className="w-12 py-3.5 pl-6">
                  <input
                    type="checkbox"
                    checked={processedVoters.length > 0 && processedVoters.every((voter) => selectedVoters.includes(voter.id))}
                    onChange={toggleAllProcessed}
                    className="h-4 w-4 cursor-pointer rounded-sm"
                  />
                </th>
                <th className="px-4 py-3.5">{t('name')}</th>
                <th className="px-4 py-3.5">{t('phone')}</th>
                <th className="px-4 py-3.5">{t('secretCode')}</th>
                <th className="px-4 py-3.5">{t('status')}</th>
                <th className="px-4 py-3.5 pr-6 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: palette.hairlineSoft }}>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[13px] font-medium" style={{ color: palette.textFaint }}>
                    Loading voter records…
                  </td>
                </tr>
              ) : processedVoters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[13px] font-medium" style={{ color: palette.textFaint }}>
                    No voters match this search.
                  </td>
                </tr>
              ) : (
                processedVoters.map((voter) => (
                  <VoterRow
                    key={voter.id}
                    {...voter}
                    selected={selectedVoters.includes(voter.id)}
                    onSelect={() => toggleVoterSelection(voter.id)}
                    onRegenerate={() => handleRegenerate(voter.id)}
                    onDelete={() => handleDelete(voter.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddVoterModal isOpen={isAddVoterOpen} onClose={() => setIsAddVoterOpen(false)} onAdd={handleAddVoter} />
      <ImportCsvModal isOpen={isImportCsvOpen} onClose={() => setIsImportCsvOpen(false)} onImport={handleBulkImport} />
    </div>
  );
};

export default VoterManagement;