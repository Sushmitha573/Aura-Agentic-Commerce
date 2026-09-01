'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { StorefrontTab } from '@/components/StorefrontTab';
import { BuyerArenaTab } from '@/components/BuyerArenaTab';
import { GrowthEngineTab } from '@/components/GrowthEngineTab';
import { AuditLedgerTab } from '@/components/AuditLedgerTab';
import { ProtocolExplorerTab } from '@/components/ProtocolExplorerTab';
import { ChaosLabTab } from '@/components/ChaosLabTab';
import { CartDrawer } from '@/components/CartDrawer';
import { RazorpayModal } from '@/components/RazorpayModal';
import { SettingsModal } from '@/components/SettingsModal';
import { Product } from '@/lib/catalog-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('storefront');
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [checkoutItems, setCheckoutItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);

  const [totalGmv, setTotalGmv] = useState(48210);
  const [keyId, setKeyId] = useState('');
  const [keySecret, setKeySecret] = useState('');

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is { product: Product; quantity: number } => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const openCheckout = (items: Array<{ product: Product; quantity: number }>, discountPercent: number = 0) => {
    setCheckoutItems(items);
    setCheckoutDiscount(discountPercent);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (orderId: string, paymentId: string, amount: number) => {
    setTotalGmv(prev => prev + amount);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        openSettings={() => setIsSettingsOpen(true)}
        isCustomKeySet={!!(keyId && keyId.startsWith('rzp_test_'))}
        totalGmv={totalGmv}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'storefront' && (
          <StorefrontTab
            cart={cart}
            addToCart={addToCart}
            openCheckout={openCheckout}
          />
        )}

        {activeTab === 'buyer-arena' && (
          <BuyerArenaTab
            openCheckout={openCheckout}
            onSimulationComplete={() => {}}
          />
        )}

        {activeTab === 'growth-engine' && (
          <GrowthEngineTab
            totalGmv={totalGmv}
          />
        )}

        {activeTab === 'audit-ledger' && (
          <AuditLedgerTab />
        )}

        {activeTab === 'protocol' && (
          <ProtocolExplorerTab />
        )}

        {activeTab === 'chaos-lab' && (
          <ChaosLabTab />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Aura Agentic Commerce Platform. Powered by NPCI UAP 1.0, AP2 Protocol & Razorpay Test Gateway.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Razorpay Test Mode Active
            </span>
            <span>NPCI UAP Compliant</span>
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        openCheckout={openCheckout}
      />

      <RazorpayModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={checkoutItems}
        discountPercent={checkoutDiscount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        keyId={keyId}
        setKeyId={setKeyId}
        keySecret={keySecret}
        setKeySecret={setKeySecret}
      />
    </div>
  );
}
