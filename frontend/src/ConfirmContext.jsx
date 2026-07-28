/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [prompt, setPrompt] = useState(null);

  const confirm = (options) =>
    new Promise((resolve) => {
      setPrompt({
        title: options.title || "Confirm action",
        message: options.message || "Do you want to continue?",
        confirmText: options.confirmText || "Continue",
        cancelText: options.cancelText || "Cancel",
        danger: options.danger ?? true,
        resolve,
      });
    });

  const closePrompt = (value) => {
    prompt?.resolve(value);
    setPrompt(null);
  };

  const value = useMemo(() => ({ confirm }), []);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {prompt && (
        <div className="fixed inset-0 z-[70] bg-[#0f172a]/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#e2e8f0] shadow-xl overflow-hidden text-left">
            <div className="p-6 space-y-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${prompt.danger ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#eff6ff] text-[#2563eb]"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-extrabold text-[#0f172a]">{prompt.title}</h3>
                <p className="text-[14px] font-medium text-[#64748b] leading-relaxed mt-1">{prompt.message}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => closePrompt(false)}
                className="px-4 py-2 rounded-xl border border-[#e2e8f0] bg-white text-[13px] font-bold text-[#475569] hover:bg-[#f1f5f9]"
              >
                {prompt.cancelText}
              </button>
              <button
                type="button"
                onClick={() => closePrompt(true)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold text-white ${prompt.danger ? "bg-[#dc2626] hover:bg-[#b91c1c]" : "bg-[#16a34a] hover:bg-[#15803d]"}`}
              >
                {prompt.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside ConfirmProvider");
  return context.confirm;
};
