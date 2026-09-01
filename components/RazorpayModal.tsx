'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/catalog-data';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Lock, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{ product: Product; quantity: number }>;
  discountPercent?: number;
  onPaymentSuccess?: (orderId: string, paymentId: string, amount: number) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent = 0,
  onPaymentSuccess
}) => {
  const [paymentRail, setPaymentRail] = useState<'UPI' | 'CARD'>('UPI');
  const [upiId, setUpiId] = useState('success@razorpay');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('999');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  let subtotal = 0;
  items.forEach(it => {
    subtotal += it.product.sellingPrice * it.quantity;
  });

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalAmount = Math.max(0, subtotal - discountAmount);

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            itemsCount: String(items.length),
            discountApplied: `${discountPercent}%`
          }
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create Razorpay order');
      }

      await new Promise(r => setTimeout(r, 1000));

      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 10)}`;
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: 'sig_verified_mock_hash_2026',
          amount: finalAmount
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setPaymentSuccess({
          orderId: orderData.order.id,
          paymentId: mockPaymentId,
          amount: finalAmount,
          auditHash: verifyData.auditHash
        });

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (onPaymentSuccess) {
          onPaymentSuccess(orderData.order.id, mockPaymentId, finalAmount);
        }
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl text-white z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Razorpay Test Checkout</h3>
              <p className="text-[11px] text-slate-400">Agentic Commerce Secure Payment Modal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          <div className="space-y-4 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Payment Verified & Captured!</h4>
              <p className="text-xs text-slate-400 mt-1">Transaction signed and recorded in immutable audit ledger.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Razorpay Order ID:</span>
                <span className="font-mono text-white font-bold">{paymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{paymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono text-white font-bold">₹{paymentSuccess.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 truncate">
                SHA-256: {paymentSuccess.auditHash}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20"
            >
              Done & Return to Store
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Items Ordered ({items.length}):</span>
                <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>Agent Incentive ({discountPercent}%):</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Payable:</span>
                <span className="text-emerald-400 font-mono text-base">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentRail('UPI')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  paymentRail === 'UPI'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentRail('CARD')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  paymentRail === 'CARD'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards / NetBanking</span>
              </button>
            </div>

            {paymentRail === 'UPI' ? (
              <div className="space-y-2">
                <label className="text-slate-400">Test Virtual UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500">Tip: Use <code>success@razorpay</code> for instant test approval.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-slate-400">Test Card Details</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Zap className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{isProcessing ? 'Verifying with Razorpay...' : `Authorize & Pay ₹${finalAmount.toLocaleString('en-IN')}`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
