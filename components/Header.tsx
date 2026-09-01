'use client';

import React from 'react';
import { 
  Bot, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  Radio, 
  AlertTriangle, 
  Key, 
  Sparkles,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  openSettings: () => void;
  isCustomKeySet: boolean;
  totalGmv: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openSettings,
  isCustomKeySet,
  totalGmv
}) => {
  const tabs = [
    { id: 'storefront', label: 'Storefront & In-App AI', icon: ShoppingBag, badge: null },
    { id: 'buyer-arena', label: 'AI Buyer Arena', icon: Bot, badge: 'A2A' },
    { id: 'growth-engine', label: 'Revenue Growth', icon: TrendingUp, badge: '+28%' },
    { id: 'audit-ledger', label: 'Bounded Audit', icon: ShieldCheck, badge: null },
    { id: 'protocol', label: 'UAP / AP2 Protocol', icon: Radio, badge: 'NPCI' },
    { id: 'chaos-lab', label: 'Chaos & Resilience', icon: AlertTriangle, badge: 'The Bar' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1 text-xs border-b border-slate-800 flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            NPCI UAP 1.0 & AP2 ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-400">
            Autonomous Agent-to-Agent Commerce Platform with Razorpay Test Mode
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Wallet className="w-3.5 h-3.5" />
            <span>GMV Transacted: <strong>₹{totalGmv.toLocaleString('en-IN')}</strong></span>
          </div>
          <button 
            onClick={openSettings}
            className="flex items-center gap-1 hover:text-white transition-colors text-slate-400"
            title="Configure Razorpay Keys"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>{isCustomKeySet ? 'Razorpay: Test Keys Active' : 'Razorpay: Sandbox Mode'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('storefront')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Aura Agentic
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                  Razorpay
                </span>
              </div>
              <p className="text-xs text-slate-400">AI Growth & Transactable Merchant</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all relative ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 transition-all hover:scale-105"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={openSettings}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
              aria-label="Settings"
            >
              <Key className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
