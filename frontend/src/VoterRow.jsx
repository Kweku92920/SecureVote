import React from 'react';

const VoterRow = ({ name, phone, secretCode, status, selected, onSelect, onRegenerate, onDelete }) => {
  return (
    <tr className="border-b border-[#e2e8f0]/60 hover:bg-[#f8fafc]/50 transition-colors">
      <td className="py-4 pl-6 w-12">
        <input 
          type="checkbox" 
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 text-[#16a34a] border-[#e2e8f0] rounded-md accent-[#16a34a] cursor-pointer" 
        />
      </td>
      <td className="py-4 px-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center font-bold text-[13px] select-none">
            {name.charAt(0)}
          </div>
          <span className="text-[14px] font-bold text-[#0f172a]">{name}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-left text-[13px] font-medium text-[#475569]">
        {phone}
      </td>
      <td className="py-4 px-4 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f1f5f9] rounded-lg text-[12px] font-mono font-medium text-[#475569] border border-[#e2e8f0]/40">
          <svg className="w-3.5 h-3.5 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{secretCode}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-left">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
          status === 'Verified' ? 'bg-[#ecfdf5] text-[#15803d]' : 'bg-[#fff7ed] text-[#c2410c]'
        }`}>
          {status}
        </span>
      </td>
      <td className="py-4 px-4 pr-6 text-left">
        <div className="flex items-center gap-2">
          <button 
            onClick={onRegenerate} 
            title="Regenerate Secret Code"
            className="p-1.5 text-[#94a3b8] hover:text-[#16a34a] hover:bg-[#f0fdf4] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
          </button>
          <button 
            onClick={onDelete} 
            title="Delete Voter Record"
            className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VoterRow;
