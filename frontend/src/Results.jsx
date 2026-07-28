import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Trophy,
  Users,
  Vote,
  Download,
  Printer,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { api } from '../lib/api';

const formatWhen = () =>
  new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

// ---------------------------------------------------------------------------
// Clean Professional Light Theme (Consistent with Voter Management, Dashboard & Settings)
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
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  errorText: '#DC2626',
};

const PodiumSlot = ({ candidate, place, heightClass }) => {
  const styles = {
    1: { bg: '#2563EB', text: '#FFFFFF', label: '#1D4ED8' },
    2: { bg: '#F1F5F9', text: '#0F172A', label: '#475569' },
    3: { bg: '#E2E8F0', text: '#0F172A', label: '#475569' },
  };
  const s = styles[place];

  if (!candidate) {
    return (
      <div className={`flex flex-col items-center justify-end ${heightClass} opacity-40`}>
        <div
          className="w-full max-w-[130px] rounded-t-md h-20 flex items-center justify-center text-xs font-semibold shadow-sm"
          style={{ background: palette.panelRaised, border: `1px solid ${palette.hairline}`, color: palette.textFaint }}
        >
          —
        </div>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>
          #{place}
        </p>
      </div>
    );
  }

  const barHeight = place === 1 ? 'h-36' : place === 2 ? 'h-28' : 'h-24';

  return (
    <div className={`flex flex-col items-center justify-end ${heightClass}`}>
      <div className="text-center mb-3 px-2 w-full">
        <p className="text-sm font-semibold leading-snug break-words" style={{ color: palette.text }}>{candidate.name}</p>
        <p className="text-xs font-medium mt-1" style={{ color: palette.textMuted }}>{candidate.party}</p>
        <p className="text-sm font-semibold mt-1.5" style={{ color: palette.primary, fontFamily: "'IBM Plex Mono', monospace" }}>
          {(candidate.votes ?? 0).toLocaleString()} <span style={{ color: palette.textFaint }}>({candidate.sharePct ?? 0}%)</span>
        </p>
      </div>
      <div
        className={`w-full max-w-[130px] rounded-t-md flex items-end justify-center pb-4 shadow-sm ${barHeight}`}
        style={{ background: s.bg, color: s.text }}
      >
        <span className="text-xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>#{place}</span>
      </div>
    </div>
  );
};

export default function Results() {
  const [podiumResults, setPodiumResults] = useState([]);
  const [selectedElectionTitle, setSelectedElectionTitle] = useState('');
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [printedAt] = useState(() => formatWhen());

  useEffect(() => {
    api
      .get('/results/podium')
      .then((results) => {
        setPodiumResults(results);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  const electionGroups = useMemo(() => {
    const groups = new Map();
    for (const row of podiumResults) {
      const electionTitle = row.electionTitle || row.title || 'Unknown';
      if (!groups.has(electionTitle)) {
        groups.set(electionTitle, []);
      }
      groups.get(electionTitle).push(row);
    }
    return Array.from(groups.entries());
  }, [podiumResults]);

  const filteredResults = useMemo(() => {
    if (!selectedElectionTitle) return podiumResults;
    return podiumResults.filter((row) => (row.electionTitle || row.title || 'Unknown') === selectedElectionTitle);
  }, [podiumResults, selectedElectionTitle]);

  const positionOptions = useMemo(() => {
    if (!selectedElectionTitle) return podiumResults;
    return podiumResults.filter((row) => (row.electionTitle || row.title || 'Unknown') === selectedElectionTitle);
  }, [podiumResults, selectedElectionTitle]);

  const position = useMemo(() => {
    if (!selectedPositionId) return null;
    return podiumResults.find((row) => row.positionId === selectedPositionId) || null;
  }, [podiumResults, selectedPositionId]);

  const [first, second, third] = position?.podium ?? [];
  const rankings = position?.rankings ?? [];

  const exportCsv = () => {
    const rowsToExport = position ? [position] : filteredResults;
    if (!rowsToExport.length) return;

    const lines = [['Election', 'Position', 'Winner', 'Votes Cast', 'Turnout %'].join(',')];
    for (const row of rowsToExport) {
      const winnerName = row.winner?.name || (row.tiedLeaders?.length ? 'Tie' : 'Pending');
      lines.push(
        [
          `"${String(row.electionTitle || '').replace(/"/g, '""')}"`,
          `"${String(row.title || '').replace(/"/g, '""')}"`,
          `"${String(winnerName).replace(/"/g, '""')}"`,
          row.votesCast || 0,
          row.turnoutPct ?? 0,
        ].join(',')
      );
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedElectionTitle || 'results').replace(/\s+/g, '_')}_summary.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printResults = () => window.print();

  const handleElectionChange = (event) => {
    const nextElectionTitle = event.target.value;
    setSelectedElectionTitle(nextElectionTitle);
    setSelectedPositionId('');
  };

  const handlePositionChange = (event) => {
    setSelectedPositionId(event.target.value);
  };

  const pageHeading = selectedPositionId && position
    ? (position.electionTitle || position.title || 'Results')
    : selectedElectionTitle
      ? `${selectedElectionTitle} Results`
      : 'Election Results';

  const pageSubheading = selectedPositionId && position
    ? `Seat analysis: ${position.title}`
    : selectedElectionTitle
      ? 'Metrics and standings across all ballot positions'
      : 'Verified vote distributions and official reporting';

  return (
    <div id="results-print-root" className="space-y-6 text-left max-w-7xl mx-auto px-6 sm:px-8 py-8 min-h-screen" style={{ background: palette.ink, color: palette.text, fontFamily: "'Inter', sans-serif" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden !important; }
          #results-print-root, #results-print-root * { visibility: visible !important; }
          #results-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 12mm 12mm !important;
          }
        }
      `,
        }}
      />

      {/* Masthead */}
      <header className="rounded-lg px-6 py-8 sm:p-9 shadow-sm" style={{ background: palette.text, color: palette.ink }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: palette.verifiedText }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.verifiedText, fontFamily: "'IBM Plex Mono', monospace" }}>
                Live — Election Results
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {pageHeading}
            </h1>
            <p className="text-sm font-medium max-w-2xl leading-relaxed" style={{ color: palette.textFaint }}>
              {pageSubheading}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] pt-1" style={{ color: palette.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>
              Report generated {printedAt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
            {selectedPositionId && (
              <button
                type="button"
                onClick={() => setSelectedPositionId('')}
                className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold shadow-sm transition-colors hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to overview
              </button>
            )}
            <button
              type="button"
              onClick={exportCsv}
              className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition-colors"
              style={{ background: palette.primary }}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={printResults}
              className="flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold shadow-sm transition-colors hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF' }}
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="relative">
            <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: palette.textFaint }} />
            <select
              value={selectedElectionTitle}
              onChange={handleElectionChange}
              className="w-full rounded-md px-4 py-2.5 pl-10 pr-4 text-sm font-medium shadow-sm transition-all outline-none"
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC' }}
            >
              <option value="">All elections / ballots</option>
              {electionGroups.map(([electionTitle]) => (
                <option key={electionTitle} value={electionTitle}>
                  {electionTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <BarChart3 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: palette.textFaint }} />
            <select
              value={selectedPositionId}
              onChange={handlePositionChange}
              className="w-full rounded-md px-4 py-2.5 pl-10 pr-4 text-sm font-medium shadow-sm transition-all outline-none"
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC' }}
            >
              <option value="">All contested positions</option>
              {positionOptions.map((row) => (
                <option key={row.positionId} value={row.positionId}>
                  {row.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main content */}
      {!selectedPositionId && selectedElectionTitle ? (
        <section className="space-y-6">
          <div
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-md shadow-sm"
            style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.primary, fontFamily: "'IBM Plex Mono', monospace" }}>Ballot Breakdown</p>
              <h3 className="text-xl font-semibold mt-0.5" style={{ color: palette.text }}>Active contested seats</h3>
              <p className="text-sm font-medium mt-1" style={{ color: palette.textMuted }}>
                Select a seat to view standings and vote breakdowns.
              </p>
            </div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-sm"
              style={{ background: '#ECFDF5', color: palette.verifiedText, border: '1px solid #A7F3D0' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.verifiedText }} />
              {filteredResults.length} position{filteredResults.length === 1 ? '' : 's'} synchronized
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResults.map((row) => {
              const winnerName = row.winner?.name || (row.tiedLeaders?.length ? 'Tie' : 'Pending');
              const isTie = !!row.tiedLeaders?.length;
              return (
                <button
                  key={row.positionId}
                  type="button"
                  onClick={() => setSelectedPositionId(row.positionId)}
                  className="group relative flex flex-col justify-between rounded-md p-6 text-left shadow-sm transition-all hover:shadow-md"
                  style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2.5 py-1 rounded" style={{ background: palette.panelRaised, color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                        Seat details
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {row.turnoutPct ?? 0}% turnout
                      </span>
                    </div>

                    <h4 className="text-base font-semibold leading-snug break-words" style={{ color: palette.text }}>
                      {row.title}
                    </h4>

                    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${palette.hairline}` }}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: isTie ? palette.errorText : palette.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {isTie ? 'Tie leaders' : 'Leading candidate'}
                      </p>
                      <p className="text-sm font-semibold mt-1 break-words" style={{ color: palette.text }}>
                        {winnerName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 flex flex-wrap items-center justify-between gap-2 text-sm font-medium" style={{ borderTop: `1px solid ${palette.hairline}`, color: palette.textMuted }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{row.votesCast?.toLocaleString() ?? 0} votes</span>
                    <span className="font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: palette.primary }}>
                      Inspect metrics <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : position ? (
        <div className="space-y-6">
          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <article className="rounded-md p-6 shadow-sm flex flex-col justify-between" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Registered electorate</span>
                <Users className="w-4 h-4" style={{ color: palette.primary }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: palette.text, fontFamily: "'IBM Plex Mono', monospace" }}>
                {(position.totalVoters ?? 0).toLocaleString()}
              </p>
            </article>

            <article className="rounded-md p-6 shadow-sm flex flex-col justify-between" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.verifiedText, fontFamily: "'IBM Plex Mono', monospace" }}>Total ballots cast</span>
                <Vote className="w-4 h-4" style={{ color: palette.verifiedText }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: palette.verifiedText, fontFamily: "'IBM Plex Mono', monospace" }}>
                {(position.votesCast ?? 0).toLocaleString()}
                <span className="text-sm font-medium ml-2" style={{ color: palette.verifiedText }}>({position.turnoutPct}%)</span>
              </p>
            </article>

            <article className="rounded-md p-6 shadow-sm flex flex-col justify-between" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Projected leader</span>
                <Trophy className="w-4 h-4" style={{ color: palette.primary }} />
              </div>
              <p className="text-base font-semibold truncate" style={{ color: palette.text }}>
                {position.tiedLeaders?.length
                  ? `Tie (${position.tiedLeaders.length} candidates)`
                  : position.winner?.name || 'Pending'}
              </p>
            </article>

            <article className="rounded-md p-6 shadow-sm flex flex-col justify-between" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Election state</span>
                <CheckCircle2 className="w-4 h-4" style={{ color: palette.verifiedText }} />
              </div>
              <p className="text-base font-semibold uppercase tracking-wide" style={{ color: palette.text }}>{position.status}</p>
            </article>
          </section>

          {position.votesCast > 0 ? (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Podium */}
              <div className="lg:col-span-1 rounded-md p-6 sm:p-7 shadow-sm flex flex-col justify-between" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
                <div>
                  <div className="flex items-center justify-between mb-7">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Podium standings</h3>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2.5 py-1 rounded" style={{ background: palette.panelRaised, color: palette.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>Top 3</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 items-end min-h-[220px]">
                    <PodiumSlot candidate={second} place={2} heightClass="order-1" />
                    <PodiumSlot candidate={first} place={1} heightClass="order-2" />
                    <PodiumSlot candidate={third} place={3} heightClass="order-3" />
                  </div>
                </div>
                {position.tiedLeaders?.length > 0 && (
                  <div
                    className="mt-7 p-3.5 rounded-md text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                    style={{ background: palette.errorBg, border: `1px solid ${palette.errorBorder}`, color: palette.errorText }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Tie detected: {position.tiedLeaders.map((c) => c.name).join(', ')}
                  </div>
                )}
              </div>

              {/* Rankings */}
              <div className="lg:col-span-2 rounded-md p-6 sm:p-7 shadow-sm overflow-hidden flex flex-col justify-between" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
                <div className="mb-6">
                  <h3 className="text-base font-semibold" style={{ color: palette.text }}>Ranked results breakdown</h3>
                  <p className="text-xs font-medium mt-0.5" style={{ color: palette.textMuted }}>
                    Vote totals and proportional share across all running candidates
                  </p>
                </div>

                <ul className="space-y-5">
                  {rankings.map((c) => {
                    const isPodium = c.rank <= 3 && c.votes > 0;
                    return (
                      <li key={c.id}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2.5">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <span
                              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-md text-xs font-semibold shadow-sm"
                              style={isPodium
                                ? { background: palette.primarySoft, color: palette.primary, border: `1px solid ${palette.primaryBorder}`, fontFamily: "'IBM Plex Mono', monospace" }
                                : { background: palette.panelRaised, color: palette.textMuted, border: `1px solid ${palette.hairline}`, fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                              #{c.rank}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate flex items-center gap-2" style={{ color: palette.text }}>
                                {c.name}
                                {c.rank === 1 && !position.tiedLeaders?.length ? (
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded shadow-sm" style={{ background: palette.primarySoft, color: palette.primary, border: `1px solid ${palette.primaryBorder}`, fontFamily: "'IBM Plex Mono', monospace" }}>Winner</span>
                                ) : null}
                                {c.rank === 2 ? (
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded shadow-sm" style={{ background: palette.panelRaised, color: palette.textMuted, border: `1px solid ${palette.hairline}`, fontFamily: "'IBM Plex Mono', monospace" }}>Runner-up</span>
                                ) : null}
                              </p>
                              <p className="text-xs font-medium mt-0.5" style={{ color: palette.textMuted }}>{c.party}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: palette.text, fontFamily: "'IBM Plex Mono', monospace" }}>
                            {(c.votes ?? 0).toLocaleString()}
                            <span className="text-xs font-normal ml-1.5" style={{ color: palette.textFaint }}>({c.sharePct}%)</span>
                          </p>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden shadow-sm" style={{ background: palette.panelRaised, border: `1px solid ${palette.hairline}` }}>
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(c.sharePct ?? 0, 100)}%`, background: palette.primary }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ) : (
            <div className="rounded-md p-16 text-center shadow-sm" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
              <Vote className="w-10 h-10 mx-auto mb-3" style={{ color: palette.textFaint }} />
              <h4 className="text-sm font-semibold" style={{ color: palette.text }}>No votes recorded yet</h4>
              <p className="text-xs font-medium mt-1" style={{ color: palette.textMuted }}>There is no telemetry or ballots registered for this position.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md p-20 text-center space-y-4 shadow-sm" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
          <Layers className="w-10 h-10 mx-auto" style={{ color: palette.primary }} />
          <div>
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>Select an election or position</h3>
            <p className="text-xs font-medium max-w-md mx-auto mt-1" style={{ color: palette.textMuted }}>
              Use the filters above to drill into specific ballots, position standings, or candidates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}