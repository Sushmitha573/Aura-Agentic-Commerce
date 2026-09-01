'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Cpu 
} from 'lucide-react';
import { Product, MERCHANT_CATALOG } from '@/lib/catalog-data';

interface BuyerArenaTabProps {
  openCheckout: (items: Array<{ product: Product; quantity: number }>, discountPercent?: number) => void;
  onSimulationComplete?: () => void;
}

export const BuyerArenaTab: React.FC<BuyerArenaTabProps> = ({
  openCheckout,
  onSimulationComplete
}) => {
  const [buyerName, setBuyerName] = useState('Nexus-AutoBuyer v2.4');
  const [buyerRole, setBuyerRole] = useState('Procurement Bot for Design Agency');
  const [maxBudget, setMaxBudget] = useState(18000);
  const [goalPrompt, setGoalPrompt] = useState('Procure flagship ANC headphones + 4K smart webcam within ₹18,000 budget ceiling.');
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<any[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setSimulationSteps([]);
    setFinalResult(null);

    try {
      const res = await fetch('/api/agent/simulate-buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalPrompt,
          constraints: {
            buyerName,
            buyerRole,
            maxBudgetInr: maxBudget
          }
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        const steps = data.result.steps;
        
        for (let i = 0; i < steps.length; i++) {
          await new Promise(r => setTimeout(r, 600));
          setSimulationSteps(prev => [...prev, steps[i]]);
        }

        setFinalResult(data.result);
        if (onSimulationComplete) onSimulationComplete();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setSimulationSteps([]);
    setFinalResult(null);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              NPCI UAP & AP2 Agent-to-Agent Commerce Arena
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Autonomous AI Buyer vs Merchant Growth Agent
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Watch an autonomous buyer agent query machine-readable catalog endpoints, negotiate margin-bounded bundle deals, validate policy guardrails, and execute Razorpay test transactions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              {isRunning ? <Bot className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Negotiating...' : 'Launch Agent Negotiation'}</span>
            </button>
            {simulationSteps.length > 0 && (
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                AI Buyer Configuration
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                UAP Persona
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Buyer Agent Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Agent Persona / Role</label>
                <input
                  type="text"
                  value={buyerRole}
                  onChange={(e) => setBuyerRole(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-slate-400 font-medium">Max Spend Budget (₹)</label>
                  <span className="text-emerald-400 font-mono font-bold">₹{maxBudget.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="35000"
                  step="1000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full mt-2 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium">Procurement Goal Prompt</label>
                <textarea
                  rows={3}
                  value={goalPrompt}
                  onChange={(e) => setGoalPrompt(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Active Merchant Guardrails</span>
              </div>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Minimum Gross Margin Hurdle:</span>
                  <span className="text-slate-200 font-mono font-bold">30.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Bundle Discount Cap:</span>
                  <span className="text-slate-200 font-mono font-bold">22.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Human Mandate Gate:</span>
                  <span className="text-slate-200 font-mono font-bold">&gt; ₹12,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col min-h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-white text-sm">Live Agent-to-Agent Reasoning Trace</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {simulationSteps.length} Rounds Executed
            </span>
          </div>

          {simulationSteps.length === 0 && !isRunning && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <Bot className="w-12 h-12 text-slate-600 stroke-[1.5]" />
              <div>
                <p className="text-sm font-semibold text-slate-300">Ready to initiate autonomous negotiation</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Click &apos;Launch Agent Negotiation&apos; above to watch the AI Buyer and Merchant Agent negotiate within strict margin policy bounds.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 flex-1">
            {simulationSteps.map((step, idx) => {
              const isBuyer = step.sender === 'BUYER_AGENT';
              const isMerchant = step.sender === 'MERCHANT_AGENT';
              const isGate = step.sender === 'POLICY_GATE';

              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border p-4 transition-all ${
                    isBuyer 
                      ? 'bg-blue-950/30 border-blue-900/40 text-blue-200' 
                      : isMerchant
                      ? 'bg-indigo-950/30 border-indigo-900/40 text-indigo-200'
                      : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 font-bold">
                      {isBuyer && <Bot className="w-4 h-4 text-blue-400" />}
                      {isMerchant && <TrendingUp className="w-4 h-4 text-indigo-400" />}
                      {isGate && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      <span className="uppercase tracking-wider font-mono text-[11px]">
                        {isBuyer ? buyerName : isMerchant ? 'Merchant Sales Agent' : 'Bounded Policy Gate'}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 font-mono text-slate-300 border border-slate-700/50">
                      Round #{step.stepNumber}
                    </span>
                  </div>

                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800/80 text-[11px] text-slate-400 font-mono mb-2">
                    <span className="text-amber-400 font-bold block mb-0.5">🧠 Agent Reasoning:</span>
                    {step.thought}
                  </div>

                  <p className="text-xs text-white leading-relaxed font-sans">
                    {step.message}
                  </p>

                  {step.proposedCart && step.proposedCart.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Cart Total:</span>
                        <span className="text-white font-bold font-mono">
                          ₹{step.totalAmountInr.toLocaleString('en-IN')}
                        </span>
                        {step.discountPercent > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {step.discountPercent}% Discount
                          </span>
                        )}
                      </div>
                      {step.marginPercent && (
                        <div className="flex items-center gap-1.5 text-[11px] text-indigo-300">
                          <span>Retained Merchant Margin:</span>
                          <span className="font-bold text-white">{step.marginPercent}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {finalResult && (
            <div className="mt-4 bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Autonomous Negotiation Succeeded & Policy Approved</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {finalResult.finalOrder.orderId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Final Payable</span>
                  <span className="font-bold font-mono text-white">
                    ₹{finalResult.finalOrder.finalPayableInr.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Discount Applied</span>
                  <span className="font-bold font-mono text-emerald-400">
                    {finalResult.finalOrder.discountPercent}%
                  </span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Gross Margin</span>
                  <span className="font-bold font-mono text-indigo-400">
                    {finalResult.finalOrder.marginPercent}%
                  </span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Audit Hash</span>
                  <span className="font-mono text-slate-300 text-[10px] truncate block" title={finalResult.finalOrder.auditHash}>
                    {finalResult.finalOrder.auditHash.substring(0, 10)}...
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const resolved = finalResult.finalOrder.items.map((it: any) => {
                    const p = MERCHANT_CATALOG.find(x => x.sku === it.sku);
                    return { product: p || MERCHANT_CATALOG[0], quantity: it.quantity };
                  });
                  openCheckout(resolved, finalResult.finalOrder.discountPercent);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Execute Razorpay Test Payment for Agent Order (₹{finalResult.finalOrder.finalPayableInr.toLocaleString('en-IN')})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
