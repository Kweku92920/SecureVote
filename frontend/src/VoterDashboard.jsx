import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Clock, ChevronDown, LogOut, ChevronLeft, ChevronRight, CheckCircle2, Vote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useTimer from '../hooks/useTimer';
import { api } from '../lib/api';

// ---------------------------------------------------------------------------
// Voter-facing surface in the same ledger system as the admin pages: paper
// background, ink masthead for the welcome banner (mirrors the Results
// masthead), brass as the one accent, mono for session timers and counts.
// ---------------------------------------------------------------------------
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,420;9..144,520;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .vd-display { font-family: 'Fraunces', serif; letter-spacing: -0.01em; }
    .vd-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.05em; }
    .vd-select { background: #FFFFFF; border: 1px solid #E2E4DF; color: #5B6472; transition: border-color 140ms ease; }
    .vd-select:focus { outline: none; border-color: #B8925A; }
    .vd-profile-btn { background: #FFFFFF; border: 1px solid #E2E4DF; transition: background 140ms ease; }
    .vd-profile-btn:hover { background: #F7F6F2; }
    .vd-signout:hover { background: #F5EBE9; color: #8A382F; }
    .vd-primary { background: #B8925A; transition: background 140ms ease; }
    .vd-primary:hover:not(:disabled) { background: #A9814D; }
    .vd-primary:disabled { background: #D9D3C6; }
    .vd-ghost-btn { background: #FFFFFF; border: 1px solid #E2E4DF; color: #5B6472; transition: background 140ms ease, border-color 140ms ease; }
    .vd-ghost-btn:hover:not(:disabled) { background: #F7F6F2; }
    .vd-ghost-btn:disabled { opacity: 0.4; }
    .vd-position-card { transition: border-color 160ms ease, transform 160ms ease; }
    .vd-position-card:hover { border-color: #B8925A; transform: translateY(-1px); }
    .vd-candidate { transition: border-color 160ms ease, background 160ms ease; }
    .vd-candidate:hover { border-color: #B8925A; background: #FBF8F2; }
    .vd-candidate[data-selected="true"] { border-color: #B8925A; background: #FBF8F2; box-shadow: 0 0 0 3px rgba(184,146,90,0.14); }
  `}</style>
);

const VoterDashboard = ({ user, onLogout }) => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [positions, setPositions] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [ballotOpen, setBallotOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sessionLocked, setSessionLocked] = useState(false);

  const voterId = user?.id;
  const sessionExpiresAt = user?.sessionExpiresAt;

  const loadPositions = useCallback(async () => {
    if (!voterId) return;
    try {
      setPositions(await api.get(`/positions/active?voterId=${encodeURIComponent(voterId)}`));
    } catch (error) {
      toast.error(error.message);
    }
  }, [voterId]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  const pendingPositions = useMemo(
    () => positions.filter((position) => !position.hasVoted),
    [positions]
  );

  const ballotComplete = useMemo(
    () =>
      pendingPositions.length > 0 &&
      pendingPositions.every((position) => Boolean(selectedCandidates[position.positionId])),
    [pendingPositions, selectedCandidates]
  );

  const submitBallot = useCallback(
    async ({ auto = false } = {}) => {
      if (!voterId || isVoting || sessionLocked) return;

      const votes = pendingPositions.map((position) => ({
        positionId: position.positionId,
        candidateId: selectedCandidates[position.positionId],
      }));

      if (!votes.length) {
        if (!auto) toast.error('No active positions are available to vote on.');
        return;
      }

      const missing = pendingPositions.filter((position) => !selectedCandidates[position.positionId]);
      if (missing.length) {
        if (auto) {
          setSessionLocked(true);
          toast.error('Session expired before your ballot was complete. Voting is locked.');
          if (typeof onLogout === 'function') onLogout();
        } else {
          toast.error(`Select a candidate for: ${missing.map((p) => p.title).join(', ')}`);
        }
        return;
      }

      try {
        setIsVoting(true);
        await api.post('/ballots/submit', {
          voterId,
          votes,
          revokeAfterSubmit: true,
        });
        toast.success(
          auto
            ? 'Session ended — your completed ballot was submitted automatically.'
            : 'Your full ballot was cast securely. Your access code has been retired.'
        );
        setBallotOpen(false);
        setShowConfirm(false);
        if (typeof onLogout === 'function') onLogout();
      } catch (error) {
        if (auto) {
          setSessionLocked(true);
          toast.error('Session expired. Your ballot could not be submitted.');
          if (typeof onLogout === 'function') onLogout();
        } else {
          toast.error(error.message);
        }
      } finally {
        setIsVoting(false);
      }
    },
    [voterId, isVoting, sessionLocked, pendingPositions, selectedCandidates, onLogout]
  );

  const handleSessionExpire = useCallback(() => {
    if (ballotComplete) {
      submitBallot({ auto: true });
      return;
    }
    setSessionLocked(true);
    toast.error('Voting session expired. Your access has been locked.');
    if (typeof onLogout === 'function') onLogout();
  }, [ballotComplete, submitBallot, onLogout]);

  const { formatted, isExpired, isLocked } = useTimer(sessionExpiresAt, {
    enabled: Boolean(sessionExpiresAt) && !sessionLocked,
    onExpire: handleSessionExpire,
  });

  const openBallot = () => {
    if (sessionLocked || isExpired) {
      toast.error('Your voting session has expired.');
      return;
    }
    setSelectedCandidates((current) => {
      const next = { ...current };
      return next;
    });
    setCurrentStep(0);
    setBallotOpen(true);
  };

  const currentPosition = pendingPositions[currentStep] || null;
  const currentSelection = currentPosition ? selectedCandidates[currentPosition.positionId] : '';
  const canAdvance = Boolean(currentSelection);
  const isLastStep = currentStep >= pendingPositions.length - 1;

  const selectedSummary = useMemo(
    () =>
      pendingPositions.map((position) => {
        const candidate = (position.candidates || []).find(
          (item) => item.id === selectedCandidates[position.positionId]
        );
        return { position, candidate };
      }),
    [pendingPositions, selectedCandidates]
  );

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 md:p-8" style={{ background: '#F5F6F3' }}>
      <GlobalStyle />
      <div className="max-w-6xl mx-auto space-y-6 text-left animate-in fade-in duration-200">

        {/* Top bar */}
        <div className="flex justify-between items-center gap-4">
          <div className="w-9 h-9 flex items-center justify-center shrink-0">
            <img src="/Logo.png" alt="SecureVote Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2.5">
            {sessionExpiresAt && (
              <div
                className="vd-mono px-3 py-2 rounded-md text-xs flex items-center gap-1.5"
                style={
                  isLocked || isExpired
                    ? { background: '#F5EBE9', border: '1px solid rgba(164,72,64,0.35)', color: '#8A382F' }
                    : { background: '#FFFFFF', border: '1px solid #E2E4DF', color: '#1C2430' }
                }
              >
                <Clock className="w-3.5 h-3.5" />
                {isLocked || isExpired ? 'Session expired' : formatted}
              </div>
            )}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="vd-select px-3 py-2 rounded-md text-xs font-semibold"
              aria-label={t('language')}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="vd-profile-btn flex items-center gap-2 rounded-md px-3 py-2"
              >
                <span className="vd-mono w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs" style={{ background: '#F7F0E4', color: '#8A6A38', border: '1px solid rgba(184,146,90,0.35)' }}>
                  {user.name.charAt(0)}
                </span>
                <span className="hidden sm:block text-xs font-semibold" style={{ color: '#1C2430' }}>{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: '#A7ACB2' }} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md overflow-hidden z-20" style={{ border: '1px solid #E2E4DF', boxShadow: '0 12px 28px rgba(28,36,48,0.10)' }}>
                  <div className="p-4" style={{ borderBottom: '1px solid #ECEEE9' }}>
                    <p className="vd-mono text-[10px] uppercase" style={{ color: '#8D95A0' }}>{t('profile')}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: '#1C2430' }}>{user.name}</p>
                    <p className="text-xs font-medium" style={{ color: '#8D95A0' }}>{user.phone}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="vd-signout w-full text-left px-4 py-3 text-xs font-semibold transition-colors"
                    style={{ color: '#5B6472' }}
                  >
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Welcome masthead */}
        <div className="rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: '#14181F' }}>
          <div>
            <p className="vd-mono text-[10px] uppercase mb-2" style={{ color: '#BE9A5C' }}>Voter Session</p>
            <h2 className="vd-display text-2xl" style={{ color: '#EAE6DC', fontWeight: 520 }}>
              {t('welcome')}, {user.name}
            </h2>
            <p className="text-sm font-medium mt-1" style={{ color: '#8D93A0' }}>
              Complete every active position on one ballot. Partial submissions are rejected.
            </p>
          </div>
          <div className="rounded-md px-4 py-2.5 flex items-center gap-3 self-start sm:self-auto min-w-[180px]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <p className="vd-mono text-[9px] uppercase leading-none" style={{ color: '#8D93A0' }}>Positions</p>
              <p className="text-sm font-semibold mt-1" style={{ color: '#EAE6DC' }}>
                {pendingPositions.length} of {positions.length} remaining
              </p>
            </div>
          </div>
        </div>

        {/* Positions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2" style={{ borderBottom: '1px solid #E2E4DF' }}>
            <h3 className="text-base font-semibold" style={{ color: '#1C2430' }}>{t('activeElections')}</h3>
            {pendingPositions.length > 0 && (
              <button
                onClick={openBallot}
                disabled={sessionLocked || isExpired}
                className="vd-primary px-5 py-2.5 text-white text-xs font-semibold uppercase tracking-wide rounded-md transition-colors"
              >
                Open full ballot
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((position) => (
              <div
                key={position.positionId}
                className="vd-position-card bg-white rounded-lg p-5 flex flex-col justify-between space-y-3"
                style={{ border: '1px solid #E2E4DF' }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm" style={{ color: '#1C2430' }}>{position.title}</h4>
                    <span
                      className="vd-mono text-[10px] px-2 py-0.5 rounded uppercase shrink-0"
                      style={
                        position.hasVoted
                          ? { background: '#F1F1EE', color: '#5B6472', border: '1px solid #E2E4DF' }
                          : { background: '#EEF3EE', color: '#4F6D57', border: '1px solid rgba(79,109,87,0.3)' }
                      }
                    >
                      {position.hasVoted ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  <p className="text-[13px] font-medium leading-relaxed pt-1 line-clamp-3" style={{ color: '#5B6472' }}>
                    {position.description}
                  </p>
                  <p className="vd-mono text-[11px]" style={{ color: '#8D95A0' }}>
                    {(position.candidates || []).length} candidates
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ballot modal */}
      {ballotOpen && (
        <div className="fixed inset-0 z-[100] backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overscroll-contain" style={{ background: 'rgba(20,24,31,0.55)' }}>
          <div className="w-full max-w-5xl max-h-[min(720px,calc(100vh-2rem))] bg-white rounded-lg overflow-hidden flex flex-col" style={{ border: '1px solid #E2E4DF' }}>
            <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid #E2E4DF' }}>
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#1C2430' }}>Full ballot</h3>
                <p className="vd-mono text-[11px] mt-0.5" style={{ color: '#8D95A0' }}>
                  Step {Math.min(currentStep + 1, pendingPositions.length)} of {pendingPositions.length}
                </p>
              </div>
              <div className="vd-mono text-sm flex items-center gap-1.5" style={{ color: '#8A382F' }}>
                <Clock className="w-3.5 h-3.5" />
                {formatted}
              </div>
            </div>

            <div className="px-4 sm:px-6 pt-4">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(pendingPositions.length, 1)}, minmax(0, 1fr))` }}>
                {pendingPositions.map((position, index) => (
                  <div
                    key={position.positionId}
                    className="h-1.5 rounded-full"
                    style={{
                      background:
                        index < currentStep || selectedCandidates[position.positionId]
                          ? '#B8925A'
                          : index === currentStep
                            ? '#E4CBA0'
                            : '#E2E4DF',
                    }}
                    aria-label={position.title}
                  />
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
              {currentPosition && (
                <section key={currentPosition.positionId} className="space-y-3">
                  <h4 className="text-sm font-semibold" style={{ color: '#1C2430' }}>{currentPosition.title}</h4>
                  <p className="text-xs font-medium" style={{ color: '#8D95A0' }}>{currentPosition.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(currentPosition.candidates || []).map((candidate) => {
                      const selected = selectedCandidates[currentPosition.positionId] === candidate.id;
                      return (
                        <button
                          key={candidate.id}
                          type="button"
                          data-selected={selected}
                          onClick={() =>
                            setSelectedCandidates((current) => ({
                              ...current,
                              [currentPosition.positionId]: candidate.id,
                            }))
                          }
                          className="vd-candidate text-left rounded-lg p-4"
                          style={{ border: '1px solid #E2E4DF' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md flex items-center justify-center font-semibold shrink-0 overflow-hidden" style={{ background: '#F7F0E4', color: '#8A6A38' }}>
                              {candidate.photoUrl ? (
                                <img src={candidate.photoUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                candidate.name.charAt(0)
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm truncate" style={{ color: '#1C2430' }}>{candidate.name}</p>
                              <p className="text-xs font-medium" style={{ color: '#8D95A0' }}>{candidate.party}</p>
                            </div>
                            {selected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#B8925A' }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <div className="px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row justify-between gap-3 shrink-0" style={{ borderTop: '1px solid #E2E4DF', background: '#F7F6F2' }}>
              <button
                onClick={() => setBallotOpen(false)}
                type="button"
                className="vd-ghost-btn w-full sm:w-auto px-4 py-2 rounded-md text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
                  disabled={currentStep === 0}
                  className="vd-ghost-btn w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!canAdvance) return;
                    if (isLastStep) setShowConfirm(true);
                    else setCurrentStep((step) => step + 1);
                  }}
                  disabled={isVoting || !canAdvance}
                  className="vd-primary w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-md text-white text-xs font-semibold"
                >
                  {isLastStep ? (isVoting ? t('castingVote') : 'Review ballot') : 'Next position'}
                  {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[120] backdrop-blur-sm flex items-center justify-center p-4" style={{ background: 'rgba(20,24,31,0.6)' }}>
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-lg w-full text-left mx-2" style={{ border: '1px solid #E2E4DF' }}>
            <div className="flex items-center gap-2 mb-3">
              <Vote className="w-4 h-4" style={{ color: '#B8925A' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#1C2430' }}>Confirm full ballot</h2>
            </div>
            <p className="mb-4 text-sm font-medium" style={{ color: '#5B6472' }}>
              You must vote on every active position. Your secret code will be retired after submission.
            </p>
            <ul className="mb-6 space-y-2 max-h-48 overflow-y-auto">
              {selectedSummary.map(({ position, candidate }) => (
                <li key={position.positionId} className="text-[13px]">
                  <span className="font-semibold" style={{ color: '#8D95A0' }}>{position.title}:</span>{' '}
                  <span className="vd-mono font-semibold" style={{ color: '#B8925A' }}>{candidate?.name || '—'}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="vd-ghost-btn w-full sm:w-auto px-4 py-2.5 rounded-md text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  submitBallot();
                }}
                className="vd-primary w-full sm:w-auto px-4 py-2.5 rounded-md text-white text-xs font-semibold"
              >
                Confirm ballot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;