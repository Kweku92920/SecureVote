import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/api';

const AddAdminModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      toast.error('Name and username are required.');
      return;
    }
    if (!password.trim()) {
      toast.error('Password is required.');
      return;
    }
    setSubmitting(true);
    try {
      const admin = await api.post('/admins', { name, username, password, role });
      toast.success(`${admin.name} added as ${admin.role}.`);
      onCreated(admin);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] w-full max-w-md mx-4 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-extrabold text-[#0f172a]">Add Administrator</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] font-semibold placeholder:text-[#94a3b8] focus:outline-none focus:border-[#16a34a] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. jane_admin"
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] font-semibold placeholder:text-[#94a3b8] focus:outline-none focus:border-[#16a34a] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 3 characters"
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] font-semibold placeholder:text-[#94a3b8] focus:outline-none focus:border-[#16a34a] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#334155] mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[14px] text-[#334155] font-semibold focus:outline-none focus:border-[#16a34a] transition-colors"
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#e2e8f0] rounded-xl text-[13px] font-bold text-[#64748b] hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-[13px] rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Adding…' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
