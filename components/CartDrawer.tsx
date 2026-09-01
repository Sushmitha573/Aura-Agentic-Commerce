'use client';

import React from 'react';
import { Product } from '@/lib/catalog-data';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Zap, 
  ShoppingBag 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Array<{ product: Product; quantity: number }>;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  openCheckout: (items: Array<{ product: Product; quantity: number }>, discountPercent?: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  openCheckout
}) => {
  if (!isOpen) return null;

  let subtotal = 0;
  let totalCost = 0;
  let totalMrp = 0;

  cart.forEach(item => {
    subtotal += item.product.sellingPrice * item.quantity;
    totalCost += item.product.costPrice * item.quantity;
    totalMrp += item.product.mrp * item.quantity;
  });

  const grossProfit = subtotal - totalCost;
  const grossMarginPercent = subtotal > 0 ? Math.round((grossProfit / subtotal) * 100) : 0;
  const savings = totalMrp - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base">Your Active Basket</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                {cart.reduce((sum, it) => sum + it.quantity, 0)} items
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-600 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-300">Your basket is empty</p>
                <p className="text-xs text-slate-500">Explore our catalog or ask the AI growth assistant to build a bundle.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">₹{item.product.sellingPrice.toLocaleString('en-IN')} each</span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-slate-900 rounded-lg border border-slate-800 p-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold px-1.5">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal MRP:</span>
                  <span className="line-through font-mono">₹{totalMrp.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Standard Savings:</span>
                  <span className="font-mono font-bold">-₹{savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-indigo-300">
                  <span>Retained Gross Margin:</span>
                  <span className="font-mono font-bold">{grossMarginPercent}%</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-sm font-bold text-white pt-1">
                <span>Total Payable:</span>
                <span className="text-lg font-mono text-blue-400">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  openCheckout(cart, 0);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Proceed to Razorpay Checkout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
