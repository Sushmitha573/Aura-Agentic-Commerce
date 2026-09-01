'use client';

import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  RotateCcw, 
  Filter, 
  Lock
} from 'lucide-react';
import { AuditEntry } from '@/lib/audit-store';

export const AuditLedgerTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filterActor, setFilterActor] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        if (data.logs.length > 0 && !selectedEntry) {
          setSelectedEntry(data.logs[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = async () => {
    await fetch('/api/audit', { method: 'DELETE' });
    fetchLogs();
  };

  const filteredLogs = logs.filter(l => 
    filterActor === 'ALL' ? true : l.actor === filterActor
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
              <Lock className="w-3.5 h-3.5" />
              Cryptographic Decision Ledger & Policy Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Explainable & Bounded Money Action Audit Trail
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Every financial quote, margin evaluation, discount authorization, and Razorpay payment is recorded in an immutable ledger with SHA-256 integrity hashes and mathematical policy proofs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleClear}
              className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-medium border border-red-800/50 transition-all"
            >
              Reset Ledger
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-1">
                {['ALL', 'BUYER_AGENT', 'MERCHANT_AGENT', 'POLICY_GATE', 'RAZORPAY_GATEWAY'].map(actor => (
                  <button
                    key={actor}
                    onClick={() => setFilterActor(actor)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                      filterActor === actor 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {actor}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {filteredLogs.length} events
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredLogs.map((entry) => {
              const isSelected = selectedEntry?.id === entry.id;
              let statusBadge = { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'PASSED' };
              if (entry.policyStatus === 'GATED') statusBadge = { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'GATED' };
              if (entry.policyStatus === 'WARNING') statusBadge = { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'WARNING' };
              if (entry.policyStatus === 'FAILED') statusBadge = { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'FAILED' };
              if (entry.policyStatus === 'RECOVERED') statusBadge = { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', label: 'RECOVERED' };

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.2 rounded font-mono text-[10px] bg-slate-800 text-slate-300">
                        {entry.actor}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-xs">{entry.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{entry.details}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>SHA-256: {entry.sha256Hash.substring(0, 12)}...</span>
                    {entry.metadata.amountInr && (
                      <span className="text-emerald-400 font-bold">
                        ₹{entry.metadata.amountInr.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              Event Explainability Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {selectedEntry ? selectedEntry.id : 'No selection'}
            </span>
          </div>

          {selectedEntry ? (
            <div className="space-y-4 flex-1 overflow-y-auto text-xs pr-1">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Title & Actor</span>
                <h4 className="font-bold text-white text-sm mt-0.5">{selectedEntry.title}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                    Actor: {selectedEntry.actor}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    Type: {selectedEntry.eventType}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Event Narrative</span>
                <p className="text-slate-300 mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed text-[11px]">
                  {selectedEntry.details}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Bounded Policy Metrics</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Transaction Value</span>
                    <span className="font-mono font-bold text-white text-xs">
                      {selectedEntry.metadata.amountInr ? `₹${selectedEntry.metadata.amountInr.toLocaleString('en-IN')}` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Gross Margin Retained</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {selectedEntry.metadata.marginPercent ? `${selectedEntry.metadata.marginPercent}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Discount Rate</span>
                    <span className="font-mono font-bold text-blue-400 text-xs">
                      {selectedEntry.metadata.discountPercent ? `${selectedEntry.metadata.discountPercent}%` : '0%'}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Order ID Ref</span>
                    <span className="font-mono text-slate-300 text-[10px] truncate block">
                      {selectedEntry.metadata.orderId || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Immutable SHA-256 Hash Proof</span>
                <div className="mt-1 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400 break-all select-all">
                  {selectedEntry.sha256Hash}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select an audit entry from the left to view detailed policy proof.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
