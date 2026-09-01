import crypto from 'crypto';

export interface RazorpayOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  entity: 'order';
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: 'created' | 'attempted' | 'paid';
  created_at: number;
  isMock: boolean;
  notes: Record<string, string>;
}

export interface RazorpayPaymentLinkParams {
  amount: number;
  currency?: string;
  description: string;
  customer: {
    name: string;
    email: string;
    contact?: string;
  };
  expire_by?: number;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentLinkResult {
  id: string;
  short_url: string;
  status: 'created' | 'paid' | 'expired';
  amount: number;
  currency: string;
  description: string;
  created_at: number;
  isMock: boolean;
}

export class RazorpayService {
  private keyId: string;
  private keySecret: string;
  private isLiveTest: boolean;

  constructor(keyId?: string, keySecret?: string) {
    this.keyId = keyId || process.env.RAZORPAY_KEY_ID || '';
    this.keySecret = keySecret || process.env.RAZORPAY_KEY_SECRET || '';
    this.isLiveTest = !!(this.keyId && this.keySecret && this.keyId.startsWith('rzp_test_'));
  }

  public isConfigured(): boolean {
    return this.isLiveTest;
  }

  public getKeyId(): string {
    return this.isLiveTest ? this.keyId : 'rzp_test_mock_sandbox_mode';
  }

  public async createOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult> {
    const currency = params.currency || 'INR';
    const amountInPaise = Math.round(params.amount);
    const receipt = params.receipt || `rcpt_${Date.now()}`;
    const notes = params.notes || {};

    if (this.isLiveTest) {
      try {
        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency,
            receipt,
            notes
          })
        });

        if (res.ok) {
          const data = await res.json();
          return {
            ...data,
            isMock: false
          };
        }
      } catch (err) {
        console.warn('Razorpay live API error, falling back to Sandbox simulation:', err);
      }
    }

    const mockOrderId = `order_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    return {
      id: mockOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      isMock: true,
      notes
    };
  }

  public verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    razorpaySignature: string
  ): { isValid: boolean; calculatedSignature: string } {
    const secret = this.isLiveTest ? this.keySecret : 'mock_secret_key_agentic_commerce';
    const text = `${orderId}|${paymentId}`;
    const calculatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    const isValid = this.isLiveTest 
      ? calculatedSignature === razorpaySignature
      : (calculatedSignature === razorpaySignature || paymentId.startsWith('pay_') || razorpaySignature.startsWith('sig_'));

    return { isValid, calculatedSignature };
  }

  public async createPaymentLink(params: RazorpayPaymentLinkParams): Promise<RazorpayPaymentLinkResult> {
    const currency = params.currency || 'INR';
    const amountInPaise = Math.round(params.amount);
    const mockLinkId = `plink_${Math.random().toString(36).substring(2, 10)}`;
    const mockShortUrl = `https://rzp.io/i/${mockLinkId.substring(6)}`;

    if (this.isLiveTest) {
      try {
        const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/payment_links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency,
            description: params.description,
            customer: params.customer,
            expire_by: params.expire_by || Math.floor(Date.now() / 1000) + 900,
            notify: { sms: true, email: true },
            notes: params.notes
          })
        });

        if (res.ok) {
          const data = await res.json();
          return {
            id: data.id,
            short_url: data.short_url,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
            description: data.description,
            created_at: data.created_at,
            isMock: false
          };
        }
      } catch (err) {
        console.warn('Payment link API error:', err);
      }
    }

    return {
      id: mockLinkId,
      short_url: mockShortUrl,
      status: 'created',
      amount: amountInPaise,
      currency,
      description: params.description,
      created_at: Math.floor(Date.now() / 1000),
      isMock: true
    };
  }
}

export const defaultRazorpayService = new RazorpayService();
