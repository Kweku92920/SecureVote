import React, { useState, useMemo } from 'react';
import VoterCardBadge from './VoterCardBadge';

const VoterCardsPanel = ({ votersDataset, onBackToVoters }) => {
  const [selectedElection, setSelectedElection] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(true);

  // Filter the dataset to extract printable tokens based on verification states
  const printableCards = useMemo(() => {
    return votersDataset.filter(voter => {
      if (onlyVerified && voter.status !== 'Verified') {
        return false;
      }
      return true;
    });
  }, [votersDataset, onlyVerified]);

  // Handle system print functionality
  const executeSystemPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      
      {/* Structural Context Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e2e8f0]/40 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Voter Cards</h2>
          <p className="text-[14px] font-medium text-[#64748b] mt-0.5">Print physical voter cards containing names and secret codes for distribution.</p>
        </div>
        
        {/* Navigation Escape Trigger Link Control */}
        <button 
          onClick={onBackToVoters}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#334155] rounded-xl font-bold text-[13px] shadow-xs transition-colors self-start sm:self-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          backToVoters
        </button>
      </div>

      {/* Target Operations Configuration Control Dashboard Area Box */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        
        {/* Dropdown Select Controls Stack */}
        <div className="flex-1 max-w-xl space-y-2">
          <label className="block text-[13px] font-bold text-[#334155]">Select Election</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] font-semibold focus:outline-none focus:border-[#16a34a] shadow-xs transition-colors"
            >
              <option value="all">All Elections / General</option>
              <option value="presidential">2024 Presidential Election</option>
              <option value="council">City Council Elections 2024</option>
            </select>

            {/* Checkbox State Selector Switch Wrapper */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <input
                type="checkbox"
                id="verifyToggle"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 text-[#16a34a] border-[#e2e8f0] rounded-md focus:ring-[#16a34a] accent-[#16a34a] cursor-pointer"
              />
              <label htmlFor="verifyToggle" className="text-[13px] font-bold text-[#475569] select-none cursor-pointer">
                Only verified voters
              </label>
            </div>
          </div>
        </div>

        {/* Operational Trigger Action Printing Executer Block Element */}
        <div className="flex flex-col items-stretch md:items-end justify-end gap-1.5">
          <p className="text-[13px] font-semibold text-[#64748b]">
            <span className="text-[#0f172a] font-bold">{printableCards.length}</span> voter cards ready to print
          </p>
          <button
            onClick={executeSystemPrint}
            disabled={printableCards.length === 0}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:bg-neutral-200 text-white disabled:text-neutral-400 rounded-xl font-bold text-[14px] shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Cards
          </button>
        </div>

      </div>

      {/* Grid Canvas Section Display Framework */}
      <div>
        <h3 className="text-[14px] font-bold text-[#334155] mb-4 print:hidden">Preview</h3>
        
        {printableCards.length > 0 ? (
          <div className="voter-card-print-area grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
            {printableCards.map((voter, index) => (
              <VoterCardBadge
                key={voter.secretCode}
                name={voter.name}
                secretCode={voter.secretCode}
                phone={voter.phone}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-[#cbd5e1] rounded-2xl p-12 text-center text-[#64748b] font-medium text-[14px]">
            No verified voter records match the current criteria.
          </div>
        )}
      </div>

      {/* Global Embedded Hardware Print Styles Override Patch Rule Engine */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 12mm;
          }
          body {
            background: white !important;
          }
          body * { visibility: hidden; }
          .voter-card-print-area, .voter-card-print-area * { visibility: visible; }
          .voter-card-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px !important;
          }
          .voter-card-print-area > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}} />

    </div>
  );
};

export default VoterCardsPanel;
