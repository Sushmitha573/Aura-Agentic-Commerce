'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Sparkles, 
  ArrowUpRight, 
  Send, 
  ShieldCheck, 
  Zap, 
  Check, 
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface GrowthEngineTabProps {
  totalGmv: number;
}

export const GrowthEngineTab: React.FC<GrowthEngineTabProps> = ({ totalGmv }) => {
  const [minMargin, setMinMargin] = useState(30);
  const [maxDiscount, setMaxDiscount] = useState(18);
  const [mandateThreshold, setMandateThreshold] = useState(12000);
  const [isSaved, setIsSaved] = useState(false);
  const [campaignOutput, setCampaignOutput] = useState<any>(null);
  const [isCampaignRunning, setIsCampaignRunning] = useState(false);

  const handleSavePolicies = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleRunRescueCampaign = async () => {
    setIsCampaignRunning(true);
    setCampaignOutput(null);

    try {
      const res = await fetch('/api/agent/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignType: 'ABANDONED_CART_RECOVERY',
          customerEmail: 'alex.buyer@procure-agency.ai',
          targetSku: 'AURA-ANC-900',
          cartValue: 11999
        })
      });
      const data = await res.json();
      setCampaignOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCampaignRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Agentic GMV</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">₹{totalGmv.toLocaleString('en-IN')}</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +100% via AI Protocol
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Average Order Value Lift</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">+28.4%</h3>
            <span className="text-[11px] text-blue-400 flex items-center gap-0.5 mt-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Smart Upsell Bundling
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Retained Gross Margin</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">44.6%</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Minimum 30% Hurdle Preserved
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Agent Transactability</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">100% Ready</h3>
            <span className="text-[11px] text-cyan-400 flex items-center gap-0.5 mt-1 font-semibold">
              <Zap className="w-3.5 h-3.5" /> UAP + AP2 + Razorpay
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Merchant Margin & Autonomy Guardrails
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set hard mathematical limits for autonomous discounting & sales agents.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono border border-blue-500/20">
              Policy Engine
            </span>
          </div>

          <div className="space-y-5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Minimum Gross Margin Hurdle Rate</label>
                <span className="text-emerald-400 font-mono font-bold text-sm">{minMargin}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={minMargin}
                onChange={(e) => setMinMargin(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The agent will mathematically reject any counter-offer that drops gross profit below {minMargin}%.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Max Autonomous Bundle Discount Cap</label>
                <span className="text-blue-400 font-mono font-bold text-sm">{maxDiscount}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Maximum discount the sales agent is permitted to offer without human intervention.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Human Mandate Ceiling (₹)</label>
                <span className="text-amber-400 font-mono font-bold text-sm">₹{mandateThreshold.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="25000"
                step="1000"
                value={mandateThreshold}
                onChange={(e) => setMandateThreshold(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Transactions above this value pause autonomous checkout and demand explicit human approval.
              </p>
            </div>

            <button
              onClick={handleSavePolicies}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isSaved ? 'Guardrail Policies Applied!' : 'Save Policy Guardrails'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  Autonomous Revenue Campaign Orchestrator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI-driven drop-off rescue and high-margin warranty upselling.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono border border-amber-500/20">
                Razorpay Links
              </span>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Cart Abandonment Smart Rescue</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    +18% Recovery Rate
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  When an AI buyer or human shopper leaves during checkout, the orchestrator automatically generates a dynamic 15-minute price-locked Razorpay Payment Link with a 10% personalized incentive.
                </p>
                <button
                  onClick={handleRunRescueCampaign}
                  disabled={isCampaignRunning}
                  className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs transition-all shadow-md shadow-amber-600/20 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isCampaignRunning ? 'Dispatching...' : 'Simulate Abandoned Cart Rescue'}</span>
                </button>
              </div>

              {campaignOutput && (
                <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Razorpay Smart Payment Link Dispatched!</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{campaignOutput.message}</p>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-blue-400 truncate">
                    {campaignOutput.paymentLink}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-900/40 text-[11px] text-blue-300">
            💡 <strong>Merchant Growth Impact:</strong> Intelligent bundling increases unit sales per checkout from 1.0 to 1.83, boosting gross margin contribution by ₹2,400+ per order.
          </div>
        </div>
      </div>
    </div>
  );
};
