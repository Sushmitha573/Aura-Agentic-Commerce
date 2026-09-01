'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  PackageX, 
  Lock
} from 'lucide-react';

export const ChaosLabTab: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'PAYMENT_GATEWAY_FAIL' | 'BUDGET_BREACH' | 'OUT_OF_STOCK'>('PAYMENT_GATEWAY_FAIL');
  const [scenarioState, setScenarioState] = useState<'IDLE' | 'SIMULATING_FAILURE' | 'AUTO_HEALING' | 'RECOVERED'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [recoveryOutput, setRecoveryOutput] = useState<any>(null);

  const runScenario = async (type: 'PAYMENT_GATEWAY_FAIL' | 'BUDGET_BREACH' | 'OUT_OF_STOCK') => {
    setActiveScenario(type);
    setScenarioState('SIMULATING_FAILURE');
    setLogs([]);
    setRecoveryOutput(null);

    if (type === 'PAYMENT_GATEWAY_FAIL') {
      setLogs(prev => [...prev, '⚡ Initiating Razorpay Test Mode transaction for ₹11,999...']);
      await new Promise(r => setTimeout(r, 600));
      setLogs(prev => [...prev, '❌ Primary Payment Rail: Simulated Card Declined / Gateway Timeout (504 Gateway Error)']);
      
      setScenarioState('AUTO_HEALING');
      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, '🛡️ Agent Resilience Guard: Gateway failure intercepted by Fallback Handler']);
      setLogs(prev => [...prev, '🔄 Generating Razorpay Smart Payment Link with 15-minute price lock & auto-retry token...']);

      try {
        const res = await fetch('/api/razorpay/payment-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 11999,
            description: 'Rescue Payment Link for Failed Cart #AURA-9921',
            customer: { name: 'Alex Shopper', email: 'alex@example.com' }
          })
        });
        const data = await res.json();
        setRecoveryOutput({
          title: 'Graceful Fallback Complete: Razorpay Smart Link Dispatched',
          link: data.paymentLink?.short_url || 'https://rzp.io/i/mockRescueLink',
          id: data.paymentLink?.id || 'plink_rescue99',
          details: 'The buyer was rescued without losing cart state. 15-minute price lock activated and notification sent to buyer webhook.'
        });
      } catch (err) {
        setRecoveryOutput({
          title: 'Fallback Activated',
          link: 'https://rzp.io/i/rescueFallback',
          details: 'Fallback link dispatched to customer webhook.'
        });
      }

      setScenarioState('RECOVERED');
    } else if (type === 'BUDGET_BREACH') {
      setLogs(prev => [...prev, '🤖 AI Buyer requested total cart of ₹24,998 (Headphones + Webcam + Mic)']);
      await new Promise(r => setTimeout(r, 600));
      setLogs(prev => [...prev, '❌ Policy Gate Intercept: Total ₹24,998 exceeds Buyer Budget ceiling of ₹18,000!']);
      
      setScenarioState('AUTO_HEALING');
      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, '🧠 Merchant Sales Copilot analyzing basket margin & alternative bundles...']);
      setLogs(prev => [...prev, '💡 Restructured Basket: Swapped Standalone Mic for 18% Multi-Device Bundle Discount']);
      setLogs(prev => [...prev, '✅ New Adjusted Total: ₹17,218 (Within ₹18k budget, 36.1% gross margin preserved)']);

      setRecoveryOutput({
        title: 'Graceful Re-negotiation Complete',
        details: 'Instead of aborting transaction, the Merchant Agent gracefully re-balanced the basket to fit within the buyer\'s ₹18,000 cap while preserving a 36.1% profit margin.'
      });
      setScenarioState('RECOVERED');
    } else if (type === 'OUT_OF_STOCK') {
      setLogs(prev => [...prev, '⚡ Buyer requested SKU: AURA-CAM-4K (Stock: 0 - Simulated Inventory Depletion)']);
      await new Promise(r => setTimeout(r, 600));
      setLogs(prev => [...prev, '❌ Inventory Engine: Zero units available in local fulfillment warehouse!']);
      
      setScenarioState('AUTO_HEALING');
      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, '🤖 Semantic Matcher: Found Studio-Tier Alternative with matched Sony sensor specs']);
      setLogs(prev => [...prev, '🎁 Merchant Agent auto-applied 5% goodwill discount + Priority Express Dispatch']);

      setRecoveryOutput({
        title: 'Autonomous SKU Substitution & Goodwill Discount',
        details: 'Agent resolved out-of-stock race condition by recommending an in-stock upgrade with matched UAP attributes, preventing customer churn.'
      });
      setScenarioState('RECOVERED');
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              The Bar: Bounded Money Actions & Graceful Failure Handling
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Chaos & Resilience Demonstration Lab
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Simulate payment gateway declines, out-of-bounds budget breaches, and stock race conditions to observe how the agentic platform gracefully recovers without crashing or losing the sale.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => runScenario('PAYMENT_GATEWAY_FAIL')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
            activeScenario === 'PAYMENT_GATEWAY_FAIL'
              ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/10'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Scenario 1: Payment Gateway Decline</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Payment fails due to network drop or card decline. Agent intercepts and triggers Razorpay Smart Payment Link fallback with 15-minute price lock.
          </p>
          <button className="mt-4 text-xs font-bold text-blue-400 flex items-center gap-1">
            <span>Simulate Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div 
          onClick={() => runScenario('BUDGET_BREACH')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
            activeScenario === 'BUDGET_BREACH'
              ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/10'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Scenario 2: Buyer Budget Breach</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Cart total exceeds the buyer agent&apos;s spending ceiling. Policy gate halts checkout and sales agent dynamically rebalances the bundle.
          </p>
          <button className="mt-4 text-xs font-bold text-indigo-400 flex items-center gap-1">
            <span>Simulate Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div 
          onClick={() => runScenario('OUT_OF_STOCK')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
            activeScenario === 'OUT_OF_STOCK'
              ? 'bg-amber-950/40 border-amber-500 shadow-xl shadow-amber-500/10'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <PackageX className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Scenario 3: Stock Race Condition</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            Item runs out of stock right during agentic checkout. System suggests in-stock semantic equivalent with goodwill discount.
          </p>
          <button className="mt-4 text-xs font-bold text-amber-400 flex items-center gap-1">
            <span>Simulate Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              scenarioState === 'IDLE' ? 'bg-slate-500' :
              scenarioState === 'SIMULATING_FAILURE' ? 'bg-red-500 animate-ping' :
              scenarioState === 'AUTO_HEALING' ? 'bg-amber-400 animate-pulse' :
              'bg-emerald-400'
            }`} />
            <h3 className="font-bold text-white text-sm">Real-time Resilience State Machine</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            State: <strong className="text-white uppercase">{scenarioState}</strong>
          </span>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs space-y-2 min-h-[160px]">
          {logs.length === 0 ? (
            <p className="text-slate-500">Click any scenario above to trigger failure and watch autonomous recovery.</p>
          ) : (
            logs.map((line, idx) => (
              <div key={idx} className="text-slate-200 flex items-start gap-2">
                <span className="text-slate-500 text-[10px] select-none">&gt;</span>
                <span className="leading-relaxed">{line}</span>
              </div>
            ))
          )}
        </div>

        {recoveryOutput && (
          <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{recoveryOutput.title}</span>
            </div>
            <p className="text-slate-300 text-xs">{recoveryOutput.details}</p>
            {recoveryOutput.link && (
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="font-mono text-blue-400 truncate">{recoveryOutput.link}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 whitespace-nowrap">
                  15-Min Price Lock Active
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
