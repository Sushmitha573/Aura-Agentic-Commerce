'use client';

import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyId: string;
  setKeyId: (k: string) => void;
  keySecret: string;
  setKeySecret: (s: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  keyId,
  setKeyId,
  keySecret,
  setKeySecret
}) => {
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl text-white z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Razorpay API Credentials</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/40 text-slate-300 text-[11px] leading-relaxed">
            💡 <strong>Sandbox Out-of-the-Box:</strong> By default, this app includes a high-fidelity Sandbox mode. If you have your own Razorpay Test Keys (<code>rzp_test_...</code>), paste them below to verify against live Razorpay servers.
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Razorpay Test Key ID</label>
            <input
              type="text"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="rzp_test_YourTestKeyId"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Razorpay Test Key Secret</label>
            <input
              type="password"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              placeholder="YourKeySecret"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{saved ? 'Credentials Saved!' : 'Save & Activate Keys'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
