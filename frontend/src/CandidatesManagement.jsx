import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { UserPlus2, ImagePlus, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { api } from "../lib/api";

const pageSize = 12;

// ---------------------------------------------------------------------------
// Clean Professional Light Theme (Consistent with Dashboard & Settings)
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
  dangerHoverBg: '#FEF2F2',
  dangerText: '#DC2626',
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .cm-root { font-family: 'Inter', sans-serif; background: ${palette.ink}; color: ${palette.text}; }
    .cm-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.04em; }
    .cm-field {
      background: #FFFFFF; border: 1px solid ${palette.hairline}; color: ${palette.text};
      transition: border-color 140ms ease, box-shadow 140ms ease;
    }
    .cm-field:focus { outline: none; border-color: ${palette.primary}; box-shadow: 0 0 0 3px ${palette.primarySoft}; }
    .cm-field::placeholder { color: ${palette.textFaint}; }
    .cm-upload { transition: background 140ms ease, border-color 140ms ease; background: ${palette.panelRaised}; }
    .cm-upload:hover { background: ${palette.primarySoft}; border-color: ${palette.primary}; color: ${palette.primary}; }
    .cm-submit { background: ${palette.primary}; transition: background 140ms ease; }
    .cm-submit:hover:not(:disabled) { background: ${palette.primaryDim}; }
    .cm-submit:disabled { background: ${palette.textFaint}; }
    .cm-row { transition: background 140ms ease; background: ${palette.panelRaised}; border: 1px solid ${palette.hairlineSoft}; }
    .cm-row:hover { background: #FFFFFF; border-color: ${palette.hairline}; }
    .cm-remove { color: ${palette.textFaint}; transition: color 140ms ease, background 140ms ease; }
    .cm-remove:hover { color: ${palette.dangerText}; background: ${palette.dangerHoverBg}; }
    .cm-page-btn { border: 1px solid ${palette.hairline}; color: ${palette.textMuted}; transition: border-color 140ms ease, color 140ms ease; background: ${palette.panel}; }
    .cm-page-btn:hover:not(:disabled) { border-color: ${palette.primary}; color: ${palette.primary}; background: ${palette.primarySoft}; }
    .cm-page-btn:disabled { opacity: 0.4; }
  `}</style>
);

const CandidatesManagement = () => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState("");
  const [form, setForm] = useState({ name: "", position: "", photoUrl: "", party: "Independent" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const electionById = useMemo(
    () => new Map(elections.map((election) => [election.id, election])),
    [elections]
  );

  const loadElections = useCallback(async () => {
    const list = await api.get("/elections");
    setElections(list);
    setSelectedElectionId((current) => current || list[0]?.id || "");
  }, []);

  const loadCandidates = useCallback(async (electionId, nextPage) => {
    const query = new URLSearchParams({ page: String(nextPage), limit: String(pageSize) });
    if (electionId) query.set("electionId", electionId);
    const result = await api.get(`/candidates?${query.toString()}`);
    setCandidates(result.items || []);
    setTotalPages(Math.max(result.totalPages || 1, 1));
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        await loadElections();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [loadElections]);

  useEffect(() => {
    if (!selectedElectionId) return;
    const run = async () => {
      try {
        setLoading(true);
        setPage(1);
        await loadCandidates(selectedElectionId, 1);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selectedElectionId, loadCandidates]);

  const addCandidate = async (photoOverride = "") => {
    const photoValue = String(photoOverride || form.photoUrl || "").trim();
    const payload = {
      electionId: selectedElectionId,
      name: form.name.trim(),
      position: form.position.trim(),
      photoUrl: photoValue,
      party: form.party.trim() || "Independent",
    };

    if (!payload.electionId) return toast.error("ElectionID is required.");
    if (!payload.name) return toast.error("Candidate name is required.");
    if (!payload.position) return toast.error("Position is required.");
    if (!photoValue) return toast.error("Candidate photo is required. Choose a local image or paste an online photo URL.");

    try {
      setSaving(true);
      await api.post("/candidates", payload);
      toast.success("Candidate onboarded.");
      setForm({ name: "", position: "", photoUrl: "", party: "Independent" });
      await Promise.all([loadElections(), loadCandidates(selectedElectionId, 1)]);
      setPage(1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeCandidate = async (candidateId) => {
    try {
      setSaving(true);
      await api.delete(`/candidates/${candidateId}`);
      toast.success("Candidate removed.");
      await Promise.all([loadElections(), loadCandidates(selectedElectionId, page)]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const onPhotoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 450_000) {
      toast.error("Image too large. Use under 450KB or paste an image URL.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photoUrl: String(reader.result || "") }));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const goToPage = async (nextPage) => {
    const bounded = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(bounded);
    try {
      setLoading(true);
      await loadCandidates(selectedElectionId, bounded);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-root space-y-8 text-left p-6 sm:p-8 min-h-screen animate-in fade-in duration-200">
      <GlobalStyle />

      {/* Header */}
      <div className="pb-6" style={{ borderBottom: `1px solid ${palette.hairline}` }}>
        <p className="cm-mono text-[11px] uppercase mb-2 font-semibold" style={{ color: palette.primary }}>Candidate Registry</p>
        <h2 className="text-3xl font-semibold tracking-tight" style={{ color: palette.text }}>Candidates</h2>
        <p className="text-sm mt-1" style={{ color: palette.textMuted }}>
          Onboard candidates independently and associate each record with an existing ElectionID.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Add candidate form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addCandidate();
          }}
          className="xl:col-span-5 rounded-lg p-6 space-y-4 shadow-sm"
          style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <UserPlus2 className="w-4 h-4" style={{ color: palette.primary }} />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>Add candidate</h3>
          </div>

          <div>
            <label className="cm-mono block text-[10.5px] uppercase mb-1.5 font-medium" style={{ color: palette.textMuted }}>ElectionID</label>
            <select
              required
              value={selectedElectionId}
              onChange={(event) => setSelectedElectionId(event.target.value)}
              className="cm-field w-full px-3.5 py-2.5 rounded-md text-sm font-medium"
            >
              {elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.title} - {election.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="cm-mono block text-[10.5px] uppercase mb-1.5 font-medium" style={{ color: palette.textMuted }}>Name</label>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="cm-field w-full px-3.5 py-2.5 rounded-md text-sm"
              placeholder="Candidate full name"
            />
          </div>

          <div>
            <label className="cm-mono block text-[10.5px] uppercase mb-1.5 font-medium" style={{ color: palette.textMuted }}>Position</label>
            <input
              required
              value={form.position}
              onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))}
              className="cm-field w-full px-3.5 py-2.5 rounded-md text-sm"
              placeholder="e.g. President, Treasurer"
            />
          </div>

          <div>
            <label className="cm-mono block text-[10.5px] uppercase mb-1.5 font-medium" style={{ color: palette.textMuted }}>Party / label</label>
            <input
              value={form.party}
              onChange={(event) => setForm((current) => ({ ...current, party: event.target.value }))}
              className="cm-field w-full px-3.5 py-2.5 rounded-md text-sm"
              placeholder="Independent"
            />
          </div>

          <div>
            <label className="cm-mono block text-[10.5px] uppercase mb-1.5 font-medium" style={{ color: palette.textMuted }}>Photo</label>
            <input
              value={form.photoUrl}
              onChange={(event) => setForm((current) => ({ ...current, photoUrl: event.target.value }))}
              className="cm-field w-full px-3.5 py-2.5 rounded-md text-sm"
              placeholder="Paste an online image URL or upload a local photo"
            />
            <p className="mt-1.5 text-xs" style={{ color: palette.textMuted }}>
              You can either upload a local image file or use a public image URL.
            </p>
            {form.photoUrl ? (
              <div className="mt-3 rounded-md p-2" style={{ border: `1px solid ${palette.hairline}`, background: palette.panelRaised }}>
                <img
                  src={form.photoUrl}
                  alt="Candidate preview"
                  className="h-24 w-full rounded object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <label className="cm-upload inline-flex items-center justify-center gap-2 cursor-pointer px-4 py-2.5 rounded-md text-xs font-semibold" style={{ border: `1px solid ${palette.hairline}`, color: palette.textMuted }}>
              <input type="file" accept="image/*" className="hidden" onChange={onPhotoFile} disabled={saving} />
              <ImagePlus className="w-3.5 h-3.5" />
              Upload local photo
            </label>
            <button
              type="submit"
              disabled={saving}
              className="cm-submit flex-1 py-2.5 rounded-md text-white text-xs font-semibold uppercase tracking-wide shadow-sm"
            >
              {saving ? "Saving..." : "Create candidate"}
            </button>
          </div>
        </form>

        {/* Candidate directory */}
        <div className="xl:col-span-7 rounded-lg p-6 shadow-sm" style={{ background: palette.panel, border: `1px solid ${palette.hairline}` }}>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: palette.primary }} />
              <h3 className="text-sm font-semibold" style={{ color: palette.text }}>Candidate directory</h3>
            </div>
            <span className="cm-mono text-[11px]" style={{ color: palette.textFaint }}>Page {page} of {totalPages}</span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm font-medium" style={{ color: palette.textFaint }}>Loading candidates...</div>
          ) : candidates.length === 0 ? (
            <div className="py-10 text-center text-sm font-medium" style={{ color: palette.textFaint }}>No candidates found.</div>
          ) : (
            <ul className="max-h-[560px] overflow-y-auto space-y-2.5">
              {candidates.map((candidate) => (
                <li key={candidate.id} className="cm-row flex items-center gap-4 px-3 py-3 rounded-md">
                  <img
                    src={candidate.photoUrl}
                    alt=""
                    className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                    style={{ border: `1px solid ${palette.hairline}`, background: palette.panelRaised }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate" style={{ color: palette.text }}>{candidate.name}</p>
                    <p className="text-xs truncate font-medium" style={{ color: palette.textMuted }}>
                      {candidate.position} · {candidate.party}
                    </p>
                    <p className="cm-mono text-[11px] mt-0.5 truncate" style={{ color: palette.textFaint }}>
                      {electionById.get(candidate.electionId)?.title || candidate.electionId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCandidate(candidate.id)}
                    disabled={saving}
                    className="cm-remove p-2 rounded-md shrink-0"
                    aria-label={`Remove ${candidate.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-end gap-2 mt-5 pt-4" style={{ borderTop: `1px solid ${palette.hairline}` }}>
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              className="cm-page-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => goToPage(page + 1)}
              className="cm-page-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesManagement;