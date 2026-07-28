import React, { useState } from 'react';

const CreateElectionModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    maxVotes: '1',
    allowWriteIn: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in">
      {/* Modal Container Box */}
      <div className="bg-white w-full max-w-[560px] rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden flex flex-col text-left max-h-[90vh]">
        
        {/* Header Block Row */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center bg-white sticky top-0">
          <h3 className="text-[15px] font-bold text-[#0f172a]">Create New Election</h3>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 rounded-lg hover:bg-[#f1f5f9]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Title Field */}
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-2">Election Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 2025 City Council Election"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] placeholder-[#94a3b8] text-[#334155] focus:outline-none focus:border-[#2da44e] shadow-sm transition-colors"
            />
          </div>

          {/* Description Block Element */}
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-2">Description</label>
            <textarea
              rows="3"
              placeholder="Describe the purpose and scope of this election..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] placeholder-[#94a3b8] text-[#334155] focus:outline-none focus:border-[#2da44e] shadow-sm transition-colors resize-none"
            />
          </div>

          {/* Date Picker Grid Blocks Layout Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#334155] mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] focus:outline-none focus:border-[#2da44e] shadow-sm transition-colors uppercase font-medium"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#334155] mb-2">End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] focus:outline-none focus:border-[#2da44e] shadow-sm transition-colors uppercase font-medium"
              />
            </div>
          </div>

          {/* Max Multi-voters Cap Integer Field */}
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-2">Max Votes Per Voter</label>
            <input
              type="number"
              min="1"
              value={formData.maxVotes}
              onChange={(e) => setFormData({...formData, maxVotes: e.target.value})}
              className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] focus:outline-none focus:border-[#2da44e] shadow-sm transition-colors font-medium"
            />
          </div>

          {/* Write-In Option Checkbox Form Item */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="allowWriteIn"
              checked={formData.allowWriteIn}
              onChange={(e) => setFormData({...formData, allowWriteIn: e.target.checked})}
              className="w-4 h-4 text-[#16a34a] border-[#e2e8f0] rounded-md focus:ring-[#2da44e] accent-[#16a34a]"
            />
            <label htmlFor="allowWriteIn" className="text-[13px] font-bold text-[#475569] select-none cursor-pointer">
              Allow write-in candidates
            </label>
          </div>

          {/* Actions Command Button Control Row Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]/60 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] text-[14px] font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#a3e635]/80 hover:bg-[#15803d] text-[#15803d] hover:text-white text-[14px] font-bold transition-all shadow-sm"
            >
              Create New Election
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateElectionModal;
