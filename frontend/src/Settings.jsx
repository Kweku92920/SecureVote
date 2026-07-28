import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  ClipboardList,
  Ban,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { api } from '../lib/api';
import { useConfirm } from '../context/ConfirmContext';
import { useTheme } from '../context/ThemeContext';
import AddAdminModal from '../components/AddAdminModal';

// ---------------------------------------------------------------------------
// Visual tokens (Clean Professional Light Theme)
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
  brick: '#DC2626',
  brickSoft: 'rgba(220,38,38,0.06)',
  brickBorder: 'rgba(220,38,38,0.3)',
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    .set-root { background: ${palette.ink}; font-family: 'Inter', sans-serif; color: ${palette.text}; }
    .set-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.04em; }

    .set-eyebrow { display: flex; align-items: center; gap: 10px; }
    .set-eyebrow-mark { color: ${palette.primary}; font-size: 12px; }
    .set-eyebrow-rule { flex: 1; height: 1px; background: ${palette.hairline}; }

    .set-panel { background: ${palette.panel}; border: 1px solid ${palette.hairline}; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .set-row { background: ${palette.panelRaised}; border: 1px solid ${palette.hairlineSoft}; }
    .set-row:hover { border-color: ${palette.hairline}; }

    .set-btn-primary {
      background: ${palette.primary}; color: #FFFFFF; font-family: 'IBM Plex Mono', monospace;
      transition: background 150ms ease, transform 150ms ease;
    }
    .set-btn-primary:hover { background: ${palette.primaryDim}; }
    .set-btn-primary:active { transform: translateY(1px); }
    .set-btn-primary:focus-visible { outline: 2px solid ${palette.primary}; outline-offset: 2px; }

    .set-btn-danger {
      background: transparent; color: ${palette.brick}; border: 1px solid ${palette.brickBorder};
      font-family: 'IBM Plex Mono', monospace; transition: background 150ms ease, color 150ms ease;
    }
    .set-btn-danger:hover { background: ${palette.brick}; color: #FFFFFF; }
    .set-btn-danger:focus-visible { outline: 2px solid ${palette.brick}; outline-offset: 2px; }

    .set-icon-btn { color: ${palette.textFaint}; border: 1px solid transparent; transition: all 150ms ease; }
    .set-icon-btn:hover { color: ${palette.brick}; background: ${palette.brickSoft}; border-color: ${palette.brickBorder}; }
    .set-icon-btn:focus-visible { outline: 2px solid ${palette.brick}; outline-offset: 2px; }

    .set-badge {
      font-family: 'IBM Plex Mono', monospace; background: ${palette.panelRaised}; color: ${palette.primary};
      border: 1px solid ${palette.hairline};
    }

    .set-tag {
      font-family: 'IBM Plex Mono', monospace; color: ${palette.primaryDim}; border: 1px solid ${palette.primaryBorder};
      background: ${palette.primarySoft};
    }

    .set-switch { background: ${palette.hairline}; transition: background 150ms ease; border: 1px solid ${palette.hairline}; }
    .set-switch[data-on="true"] { background: ${palette.primary}; border-color: ${palette.primary}; }
    .set-switch:focus-visible { outline: 2px solid ${palette.primary}; outline-offset: 2px; }
    .set-switch-thumb { background: #FFFFFF; transition: transform 150ms ease; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .set-switch[data-on="true"] .set-switch-thumb { background: #FFFFFF; }

    .set-danger-panel { background: ${palette.brickSoft}; border: 1px solid ${palette.brickBorder}; position: relative; overflow: hidden; }
    .set-danger-panel::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: repeating-linear-gradient(135deg, ${palette.brick} 0 10px, transparent 10px 20px);
      opacity: 0.4;
    }
  `}</style>
);

const SectionMark = ({ n, label }) => (
  <div className="set-eyebrow mb-5">
    <span className="set-mono set-eyebrow-mark">§ {n}</span>
    <span className="set-mono text-[11px] uppercase" style={{ color: palette.textMuted }}>{label}</span>
    <span className="set-eyebrow-rule" />
  </div>
);

const Switch = ({ on, onToggle, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    data-on={on}
    onClick={onToggle}
    className="set-switch w-11 h-6 rounded-md p-0.5 flex items-center shrink-0"
  >
    <span
      className="set-switch-thumb w-4.5 h-4.5 rounded-sm block"
      style={{ width: '18px', height: '18px', transform: on ? 'translateX(20px)' : 'translateX(0px)' }}
    />
  </button>
);

const Settings = () => {
  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const [preferences, setPreferences] = useState({
    language: 'English',
    ipRestriction: false,
    voteConfirmation: true,
  });
  const confirm = useConfirm();
  const { setTheme } = useTheme();

  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    try {
      const data = await api.get('/admins');
      setAdmins(data);
    } catch {
      // Don't toast on initial load
    } finally {
      setLoadingAdmins(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    api.get('/settings')
      .then((settings) => {
        setTheme('light');
        setPreferences({
          language: settings.language,
          ipRestriction: settings.ipRestriction,
          voteConfirmation: settings.voteConfirmation,
        });
      })
      .catch((error) => toast.error(error.message));
  }, [setTheme]);

  const savePreferences = async (nextPreferences) => {
    setPreferences(nextPreferences);
    setTheme('light');
    try {
      await api.put('/settings', nextPreferences);
      toast.success('System preferences updated successfully.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggle = (key) => {
    savePreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleAdminCreated = (admin) => {
    setAdmins((prev) => [admin, ...prev]);
    setShowAddModal(false);
  };

  const handleDeleteAdmin = async (admin) => {
    const confirmed = await confirm({
      title: 'Remove administrator access?',
      message: `Revoke system access for ${admin.name} (@${admin.username})? This action cannot be undone.`,
      confirmText: 'Revoke Access',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/admins/${admin.id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      toast.success(`${admin.name}'s access has been revoked.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetElections = async () => {
    const confirmReset = await confirm({
      title: 'Reset all election telemetry?',
      message: 'CRITICAL: This permanently erases all active elections, candidate ballots, and voter tallies across the system. This action is irreversible.',
      confirmText: 'Yes, Reset Everything',
      cancelText: 'Abort',
    });
    if (confirmReset) {
      try {
        await api.post('/settings/reset-elections', {});
        toast.success('All election data has been completely reset.');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getInitial = (name) => (name || '?').charAt(0).toUpperCase();

  return (
    <div className="set-root min-h-screen">
      <GlobalStyle />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 space-y-12">

        {/* Header */}
        <div className="pb-8" style={{ borderBottom: `1px solid ${palette.hairline}` }}>
          <p className="set-mono text-[11px] uppercase mb-3 font-semibold" style={{ color: palette.primary }}>
            System of Record — Configuration
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: palette.text }}>
            Administration &amp; controls
          </h1>
          <p className="text-sm mt-2 max-w-lg" style={{ color: palette.textMuted }}>
            Personnel, access safeguards, and ballot behavior for this instance. Changes here take effect immediately.
          </p>
        </div>

        {/* § 1 Administrators */}
        <section>
          <SectionMark n="1" label="Administrators" />
          <div className="set-panel rounded-lg p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm" style={{ color: palette.textMuted }}>
                Accounts with authority to modify this configuration.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="set-btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-medium uppercase tracking-wide"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add administrator
              </button>
            </div>

            {loadingAdmins ? (
              <div className="set-mono text-center py-10 text-xs" style={{ color: palette.textFaint }}>
                Loading roster…
              </div>
            ) : admins.length === 0 ? (
              <div
                className="text-center py-10 text-xs rounded-lg"
                style={{ color: palette.textFaint, border: `1px dashed ${palette.hairline}` }}
              >
                No administrators on record. Add one to grant access.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="set-row group flex items-center justify-between rounded-lg p-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="set-badge w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium shrink-0">
                        {getInitial(admin.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm truncate" style={{ color: palette.text }}>
                            {admin.name}
                          </span>
                          <span className="set-tag text-[10px] uppercase px-1.5 py-0.5 rounded shrink-0">
                            {admin.role}
                          </span>
                        </div>
                        <p className="set-mono text-xs mt-0.5 truncate" style={{ color: palette.textFaint }}>
                          @{admin.username}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      className="set-icon-btn p-2 rounded-md shrink-0 ml-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      title="Revoke admin access"
                      aria-label={`Revoke access for ${admin.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* § 2 Security */}
        <section>
          <SectionMark n="2" label="Access safeguards" />
          <div className="set-panel rounded-lg p-6 sm:p-7">
            <div className="set-row flex items-center justify-between gap-4 rounded-lg p-4">
              <div className="flex items-start gap-3 min-w-0">
                <KeyRound className="w-4 h-4 mt-0.5 shrink-0" style={{ color: palette.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: palette.text }}>IP geolocation restriction</p>
                  <p className="text-xs mt-0.5" style={{ color: palette.textMuted }}>
                    Limit voting eligibility checks to approved geographic ranges.
                  </p>
                </div>
              </div>
              <Switch
                on={preferences.ipRestriction}
                onToggle={() => handleToggle('ipRestriction')}
                label="IP geolocation restriction"
              />
            </div>
          </div>
        </section>

        {/* § 3 Voting behavior */}
        <section>
          <SectionMark n="3" label="Ballot behavior" />
          <div className="set-panel rounded-lg p-6 sm:p-7">
            <div className="set-row flex items-center justify-between gap-4 rounded-lg p-4">
              <div className="flex items-start gap-3 min-w-0">
                <ClipboardList className="w-4 h-4 mt-0.5 shrink-0" style={{ color: palette.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: palette.text }}>Voter confirmation gate</p>
                  <p className="text-xs mt-0.5" style={{ color: palette.textMuted }}>
                    Require an explicit review step before a ballot is submitted.
                  </p>
                </div>
              </div>
              <Switch
                on={preferences.voteConfirmation}
                onToggle={() => handleToggle('voteConfirmation')}
                label="Voter confirmation gate"
              />
            </div>
          </div>
        </section>

        {/* § 4 Irreversible actions */}
        <section>
          <SectionMark n="4" label="Irreversible actions" />
          <div className="set-danger-panel rounded-lg p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-5">
              <Ban className="w-4 h-4" style={{ color: palette.brick }} />
              <p className="text-xs font-medium" style={{ color: palette.brick }}>
                Operations below cannot be undone. Read the confirmation carefully.
              </p>
            </div>
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg p-4"
              style={{ background: '#FFFFFF', border: `1px solid ${palette.hairline}` }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: palette.text }}>Reset all elections</p>
                <p className="text-xs mt-0.5" style={{ color: palette.textMuted }}>
                  Erases every election, ballot, and tally currently on record.
                </p>
              </div>
              <button
                onClick={handleResetElections}
                className="set-btn-danger inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs uppercase tracking-wide self-start sm:self-auto whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all elections
              </button>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 pt-2" style={{ color: palette.textFaint }}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="set-mono text-[10px] uppercase">Changes are applied immediately and logged</span>
        </div>
      </div>

      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleAdminCreated}
        />
      )}
    </div>
  );
};

export default Settings;