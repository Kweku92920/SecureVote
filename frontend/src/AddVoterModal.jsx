import React, { useState } from 'react';

const AddVoterModal = ({ isOpen, onClose, onAdd }) => {
  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name: voterName, phone: voterPhone });
    setVoterName('');
    setVoterPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in">
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden flex flex-col text-left">
        
        {/* Header Title Bar */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center">
          <h3 className="text-[15px] font-bold text-[#0f172a]">Add New Voter</h3>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#475569] p-1 rounded-lg hover:bg-[#f1f5f9] transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form Submission Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Full Name</label>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] placeholder-[#94a3b8] text-[#334155] focus:outline-none focus:border-[#16a34a] shadow-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-1.5">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 0712345678"
              value={voterPhone}
              onChange={(e) => setVoterPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] placeholder-[#94a3b8] text-[#334155] focus:outline-none focus:border-[#16a34a] shadow-sm transition-colors"
            />
          </div>

          {/* Core Info Advisory banner template segment box layout */}
          <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]/80 flex gap-3">
            <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[12px] font-medium text-[#475569] leading-relaxed">
              A unique secret code will be auto-generated for this voter. They will use this code to log in.
            </p>
          </div>

          {/* Action Row Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e2e8f0] text-[13px] font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a3e635]/80 hover:bg-[#16a34a] text-[#15803d] hover:text-white rounded-xl text-[13px] font-bold transition-all shadow-sm"
            >
              Create
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddVoterModal;