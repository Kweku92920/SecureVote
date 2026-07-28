import React from 'react';

const VoterCardBadge = ({ name, secretCode, phone, index }) => {
  // Format matching card numerical indexes: e.g., Card #0001
  const serialString = `Card #${String(index + 1).padStart(4, '0')}`;

  return (
    <div className="relative bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] rounded-2xl p-5 text-white shadow-md border border-[#065f46]/40 overflow-hidden flex flex-col justify-between min-h-[200px] w-full max-w-[380px] select-none group hover:shadow-xl transition-all print:shadow-none print:border-[#047857]">
      
      {/* Background Watermark Token Accent Text Layer */}
      <div className="absolute inset-0 flex items-center justify-center text-[64px] font-black text-black/5 tracking-widest uppercase pointer-events-none select-none">
        SecureVote
      </div>

      {/* Top Meta Line Brand Block */}
      <div className="relative flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-xs">
            <svg className="w-4 h-4 text-[#ecfdf5]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-left">
            <h5 className="text-[12px] font-bold tracking-wide uppercase leading-tight text-white">SecureVote Election</h5>
            <span className="text-[10px] font-medium text-[#ecfdf5]/80 tracking-wider uppercase leading-none block">Official Access Card</span>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-lg bg-black/15 border border-white/10 text-[#ecfdf5]">
          {serialString}
        </span>
      </div>

      {/* Center Row Profile Body Credentials Block */}
      <div className="relative z-10 text-left my-3 space-y-2">
        <div>
          <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider leading-none mb-1">Voter Name</p>
          <h4 className="text-[18px] font-bold tracking-tight text-white leading-tight truncate">{name}</h4>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider leading-none mb-1">Secret Voting Code</p>
          <div className="inline-block bg-black/25 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/15 font-mono text-[14px] font-bold tracking-widest text-[#a3e635] shadow-xs">
            {secretCode}
          </div>
        </div>
      </div>

      {/* Bottom Footer Data Metrics Alignment Line */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-3">
        <div className="text-left space-y-0.5">
          <p className="text-[11px] font-medium text-white/80">Phone: <span className="text-white font-bold">{phone}</span></p>
          <p className="text-[9px] text-white/60 font-sans tracking-wide">Keep confidential • Do not share your code</p>
        </div>

        {/* Dynamic Graphic Identity Glyph Matrix Representation Box Simulation */}
        <div className="w-8 h-8 bg-white rounded-lg p-1 shrink-0 flex flex-wrap gap-0.5 items-center justify-center shadow-xs opacity-95">
          <div className="w-3 h-3 bg-[#059669] rounded-xs"></div>
          <div className="w-3 h-3 bg-neutral-900 rounded-xs"></div>
          <div className="w-3 h-3 bg-neutral-900 rounded-xs"></div>
          <div className="w-3 h-3 bg-[#059669] rounded-xs"></div>
        </div>
      </div>

    </div>
  );
};

export default VoterCardBadge;