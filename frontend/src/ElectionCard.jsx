import React from 'react';
import { Calendar, Users, Vote, Trash2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Sixth surface in the same light ledger system as Dashboard / Candidates /
// Results. Status color carries real meaning (sage = live, brass = paused,
// steel = draft, neutral gray = ended) rather than four unrelated hues.
// ---------------------------------------------------------------------------
const statusTokens = {
  active: { bg: '#EEF3EE', text: '#4F6D57', border: 'rgba(79,109,87,0.32)', dot: '#4F6D57', pulse: true },
  paused: { bg: '#F7F0E4', text: '#8A6A38', border: 'rgba(184,146,90,0.35)', dot: '#B8925A', pulse: false },
  ended: { bg: '#F1F1EE', text: '#5B6472', border: '#E2E4DF', dot: '#8D95A0', pulse: false },
  draft: { bg: '#EEF1F4', text: '#48607A', border: 'rgba(72,96,122,0.3)', dot: '#48607A', pulse: false },
};

const statusActionLabels = {
  active: 'Pause',
  paused: 'End',
  ended: 'Restart',
  draft: 'Start',
};

const GlobalStyle = () => (
  <style>{`
    .ec-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.05em; }
    .ec-card { transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease; }
    .ec-card:hover { border-color: #B8925A; box-shadow: 0 8px 22px rgba(28,36,48,0.06); transform: translateY(-1px); }
    .ec-details { transition: background 140ms ease, color 140ms ease; }
    .ec-details:hover { background: #FBF8F2; color: #8A6A38; }
    .ec-action { transition: border-color 140ms ease, color 140ms ease; }
    .ec-action:hover { border-color: #B8925A; color: #1C2430; }
    .ec-delete { transition: color 140ms ease, background 140ms ease; }
    .ec-delete:hover { color: #8A382F; background: #F5EBE9; }
    @keyframes ec-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    .ec-pulse { animation: ec-pulse 2s ease-in-out infinite; }
  `}</style>
);

const ElectionCard = ({ title, dateRange, description, candidates, votes, status, onStatusChange, onDelete }) => {
  const token = statusTokens[status] || statusTokens.draft;

  return (
    <div
      className="ec-card bg-white rounded-lg p-5 text-left flex flex-col justify-between group"
      style={{ border: '1px solid #E2E4DF' }}
    >
      <GlobalStyle />
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h4 className="text-[15px] font-semibold leading-snug" style={{ color: '#1C2430' }}>{title}</h4>
          <span
            className="ec-mono inline-flex items-center gap-1.5 text-[10px] uppercase px-2.5 py-1 rounded shrink-0"
            style={{ background: token.bg, color: token.text, border: `1px solid ${token.border}` }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${token.pulse ? 'ec-pulse' : ''}`} style={{ background: token.dot }} />
            {status}
          </span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-xs font-medium mb-3" style={{ color: '#8D95A0' }}>
          <Calendar className="w-3.5 h-3.5" style={{ color: '#A7ACB2' }} />
          <span>{dateRange}</span>
        </div>

        {/* Description */}
        <p className="text-[13px] leading-relaxed mb-5 line-clamp-2" style={{ color: '#5B6472' }}>
          {description}
        </p>
      </div>

      <div>
        {/* Telemetry row */}
        <div
          className="grid grid-cols-2 gap-2 py-3 px-3.5 rounded-md text-xs font-medium mb-4"
          style={{ background: '#F7F6F2', border: '1px solid #ECEEE9', color: '#5B6472' }}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white" style={{ border: '1px solid #E2E4DF', color: '#8D95A0' }}>
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="ec-mono">{candidates} candidates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white" style={{ border: '1px solid #E2E4DF', color: '#8D95A0' }}>
              <Vote className="w-3.5 h-3.5" />
            </div>
            <span className="ec-mono">{votes.toLocaleString()} votes</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid #ECEEE9' }}>
          <button className="ec-details px-3 py-1.5 rounded-md text-[13px] font-semibold" style={{ color: '#B8925A' }}>
            Details
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onStatusChange}
              className="ec-action px-3 py-1.5 rounded-md bg-white text-[13px] font-semibold"
              style={{ border: '1px solid #E2E4DF', color: '#5B6472' }}
            >
              {statusActionLabels[status]}
            </button>
            <button
              onClick={onDelete}
              className="ec-delete p-2 rounded-md"
              style={{ color: '#A7ACB2' }}
              title="Delete election"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;