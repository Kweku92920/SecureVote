import React, { useRef, useState } from 'react';

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out.map((cell) => cell.replace(/^"|"$/g, ''));
}

function parseVotersFromCsv(text, defaultStatus) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const headerCells = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  let nameIdx = headerCells.findIndex((h) => /^(name|full_?name|voter)$/i.test(h.trim()) || h === 'fullname');
  let phoneIdx = headerCells.findIndex((h) => /^(phone|mobile|tel|telephone)$/i.test(h.trim()));
  let statusIdx = headerCells.findIndex((h) => /^status$/i.test(h.trim()));

  const rowsStart = nameIdx >= 0 && phoneIdx >= 0 ? 1 : 0;
  if (nameIdx < 0) nameIdx = 0;
  if (phoneIdx < 0) phoneIdx = 1;

  const out = [];
  for (let i = rowsStart; i < lines.length; i += 1) {
    const parts = splitCsvLine(lines[i]);
    const rawName = (parts[nameIdx] || '').trim();
    const rawPhone = (parts[phoneIdx] || '').trim();
    const rawStatus = statusIdx >= 0 ? (parts[statusIdx] || '').trim() : '';
    if (!rawName || !rawPhone) continue;
    let status = defaultStatus ? 'Verified' : 'Pending';
    if (rawStatus.toLowerCase() === 'verified' || rawStatus.toLowerCase() === 'pending') {
      status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
    }
    out.push({ name: rawName, phone: rawPhone.replace(/\s+/g, ''), status });
  }
  return out;
}

const ImportCsvModal = ({ isOpen, onClose, onImport }) => {
  const [autoVerify, setAutoVerify] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  if (!isOpen) return null;

  const ingestText = async (text) => {
    setError('');
    setBusy(true);
    try {
      const voters = parseVotersFromCsv(text, autoVerify);
      if (!voters.length) {
        setError('No rows found. Use columns: name, phone (header row recommended).');
        setBusy(false);
        return;
      }
      await onImport(voters);
      onClose();
    } catch (e) {
      setError(e?.message || 'Could not parse file.');
    } finally {
      setBusy(false);
    }
  };

  const ingestFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => ingestText(String(reader.result || ''));
    reader.onerror = () => setError('Could not read file.');
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    ingestFile(f);
  };

  const downloadSample = () => {
    const csv = 'name,phone,status\n"Jane Doe",0244123456,Verified\n"Kwame Ampadu",0599111222,Pending\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voters_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl border border-[#e2e8f0] overflow-hidden flex flex-col text-left max-h-[90vh]">

        <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center shrink-0">
          <h3 className="text-[15px] font-bold text-[#0f172a]">Import Voters from CSV</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#475569] p-1 rounded-lg hover:bg-[#f1f5f9] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" className="hidden" onChange={(e) => ingestFile(e.target.files?.[0])} />

          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click();
            }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer select-none transition-all ${
              dragActive ? 'border-[#16a34a] bg-[#f0fdf4]' : 'border-[#cbd5e1] hover:border-[#94a3b8] bg-[#f8fafc]/50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-center space-y-0.5">
              <p className="text-[14px] font-bold text-[#0f172a]">{busy ? 'Importing…' : 'Choose or drop CSV file'}</p>
              <p className="text-[12px] font-medium text-[#64748b]">Comma-separated rows with name &amp; phone</p>
            </div>
            <p className="text-[11px] font-semibold text-[#94a3b8] mt-1">Headers: name, phone (optional: status)</p>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="autoVerify"
              checked={autoVerify}
              onChange={(e) => setAutoVerify(e.target.checked)}
              className="w-4 h-4 text-[#16a34a] border-[#e2e8f0] rounded-md focus:ring-[#16a34a] accent-[#16a34a] cursor-pointer"
            />
            <label htmlFor="autoVerify" className="text-[13px] font-bold text-[#475569] cursor-pointer select-none">
              Mark imported voters as Verified
            </label>
          </div>

          {error && <p className="text-[13px] font-semibold text-[#991b1b]">{error}</p>}

          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={downloadSample}
              className="flex items-center gap-1.5 text-[13px] font-bold text-[#16a34a] hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download sample CSV
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e2e8f0] text-[13px] font-bold text-[#475569] hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCsvModal;
