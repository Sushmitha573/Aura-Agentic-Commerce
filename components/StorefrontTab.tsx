'use client';

import React, { useState } from 'react';
import { MERCHANT_CATALOG, Product } from '@/lib/catalog-data';
import { 
  ShoppingBag, 
  Sparkles, 
  Send, 
  Plus, 
  Check, 
  Zap,
  Bot
} from 'lucide-react';

interface StorefrontTabProps {
  cart: Array<{ product: Product; quantity: number }>;
  addToCart: (product: Product, quantity?: number) => void;
  openCheckout: (items: Array<{ product: Product; quantity: number }>, discountPercent?: number) => void;
}

export const StorefrontTab: React.FC<StorefrontTabProps> = ({
  cart,
  addToCart,
  openCheckout
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; bundle?: any }>>([
    {
      sender: 'agent',
      text: "👋 Hi! I'm Aura's Merchant Growth Agent. Tell me what setup you're looking for (e.g. 'I need a 4K streaming studio setup' or 'Best noise-cancelling headphones for coding'), and I'll build you an optimized high-value bundle with instant discounts!"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = MERCHANT_CATALOG.filter(p => 
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const categories = [
    { id: 'all', label: 'All Gear' },
    { id: 'audio', label: 'Audio & ANC' },
    { id: 'video', label: '4K Video & Studio' },
    { id: 'peripherals', label: 'Keyboards & Peripherals' },
    { id: 'power', label: 'GaN Power' },
    { id: 'services', label: 'Care+ Warranty' }
  ];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isProcessing) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/agent/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          cartSkus: cart.map(c => c.product.sku),
          buyerBudget: 22000
        })
      });
      const data = await res.json();

      if (data.success) {
        setChatMessages(prev => [
          ...prev, 
          {
            sender: 'agent',
            text: data.message,
            bundle: data.proposedBundle
          }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'agent',
            text: "I've matched our best available gear for your request below. You can customize bundles or proceed to Razorpay test checkout!"
          }
        ]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: "I'm ready with your bundle recommendation! Check the products below to add them to your cart."
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputQuery(prompt);
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Conversational Merchant & Dynamic Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Autonomous Commerce & Intelligent In-App Checkout
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Experience next-generation merchant selling: Human shoppers get personalized bundle recommendations that boost Average Order Value (AOV), while AI Buyer agents discover and negotiate bounded transactions through NPCI UAP and AP2 protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const inCart = cart.some(c => c.product.id === product.id);
              const marginEstimate = Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100);

              return (
                <div 
                  key={product.id}
                  className="group bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md text-[10px] font-mono text-blue-400 border border-slate-700">
                        {product.sku}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-800/50">
                        {product.stock} In Stock
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {product.tagline}
                      </p>
                    </div>

                    <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Merchant Cost (COGS):</span>
                        <span className="text-slate-300 font-mono">₹{product.costPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Retained Gross Margin:</span>
                        <span className="font-bold">{marginEstimate}%</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-bold text-white">
                            ₹{product.sellingPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => addToCart(product, 1)}
                          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                            inCart 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                          }`}
                          title="Add to cart"
                        >
                          {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openCheckout([{ product, quantity: 1 }], 0)}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 flex flex-col h-[680px] shadow-2xl relative">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Merchant Growth Copilot</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Dynamic Bundles & Instant Checkout
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono border border-blue-500/20">
              AOV Booster
            </span>
          </div>

          <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-slate-800/60">
            <button
              onClick={() => handleQuickPrompt("I want a complete studio podcasting setup")}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 transition-colors"
            >
              🎙️ Studio Podcasting Bundle
            </button>
            <button
              onClick={() => handleQuickPrompt("Need developer noise-cancelling setup")}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700/60 transition-colors"
            >
              🎧 Developer ANC + Keyboard
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.bundle && (
                    <div className="mt-3 bg-slate-950/80 rounded-xl p-3 border border-blue-500/30 space-y-2.5">
                      <div className="flex items-center justify-between text-blue-400 font-bold text-[11px]">
                        <span>{msg.bundle.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-[10px]">
                          Save ₹{msg.bundle.savingsInr.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-300 divide-y divide-slate-800/60">
                        {msg.bundle.items.map((it: any, i: number) => (
                          <div key={i} className="pt-1 flex justify-between">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono">₹{it.unitPrice.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-white">
                        <span>Bundle Price ({msg.bundle.bundleDiscountPercent}% OFF):</span>
                        <span className="text-emerald-400 font-mono text-sm">
                          ₹{msg.bundle.finalTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const resolved = msg.bundle.items.map((it: any) => {
                            const p = MERCHANT_CATALOG.find(x => x.sku === it.sku);
                            return { product: p || MERCHANT_CATALOG[0], quantity: it.quantity };
                          });
                          openCheckout(resolved, msg.bundle.bundleDiscountPercent);
                        }}
                        className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Accept Bundle & Razorpay Checkout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <Bot className="w-4 h-4 text-blue-400 animate-spin" />
                <span>Growth Agent is evaluating margin & crafting dynamic bundle...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask for custom setup, discount or bundle..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isProcessing}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
