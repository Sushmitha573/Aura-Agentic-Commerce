import { MERCHANT_CATALOG, Product } from './catalog-data';
import { DEFAULT_MERCHANT_POLICY } from './policies';

export interface UAPCatalogResponse {
  protocol: 'NPCI_UAP/1.0' | 'AP2/2026' | 'ACP/1.0';
  merchant: {
    id: string;
    name: string;
    endpoint: string;
    supportedCurrencies: string[];
    supportedPaymentRails: string[];
    sandboxMode: boolean;
    agenticCapabilities: {
      autonomousNegotiation: boolean;
      dynamicBundling: boolean;
      instantCheckout: boolean;
      x402MicroPayments: boolean;
    };
  };
  catalog: {
    version: string;
    itemCount: number;
    items: Array<{
      id: string;
      sku: string;
      title: string;
      category: string;
      pricing: {
        currency: 'INR';
        mrp: number;
        standardPrice: number;
        floorPrice: number;
        maxAutoNegotiateDiscountPercent: number;
      };
      inventory: {
        available: number;
        status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
      };
      attributes: Record<string, string>;
      bundleAffinities: Array<{
        sku: string;
        discountIncentivePercent: number;
      }>;
    }>;
  };
  policyConstraints: {
    minimumMarginHurdlePercent: number;
    humanMandateThresholdInr: number;
    dailyVelocityCapInr: number;
  };
}

export function generateUAPCatalog(appUrl: string = 'http://localhost:3000'): UAPCatalogResponse {
  return {
    protocol: 'NPCI_UAP/1.0',
    merchant: {
      id: DEFAULT_MERCHANT_POLICY.merchantId,
      name: DEFAULT_MERCHANT_POLICY.merchantName,
      endpoint: `${appUrl}/api/agent`,
      supportedCurrencies: ['INR'],
      supportedPaymentRails: ['RAZORPAY_UPI', 'RAZORPAY_CARD', 'RAZORPAY_NETBANKING', 'RAZORPAY_SMART_PAYMENT_LINK'],
      sandboxMode: true,
      agenticCapabilities: {
        autonomousNegotiation: true,
        dynamicBundling: true,
        instantCheckout: true,
        x402MicroPayments: true
      }
    },
    catalog: {
      version: '2026.08.30-v1',
      itemCount: MERCHANT_CATALOG.length,
      items: MERCHANT_CATALOG.map(p => ({
        id: p.id,
        sku: p.sku,
        title: p.name,
        category: p.category,
        pricing: {
          currency: 'INR',
          mrp: p.mrp,
          standardPrice: p.sellingPrice,
          floorPrice: p.floorPrice,
          maxAutoNegotiateDiscountPercent: DEFAULT_MERCHANT_POLICY.maxSingleItemDiscountPercent
        },
        inventory: {
          available: p.stock,
          status: p.stock > 10 ? 'IN_STOCK' : p.stock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'
        },
        attributes: p.specs,
        bundleAffinities: p.upsellAffinities.map(a => ({
          sku: a.targetSku,
          discountIncentivePercent: a.bundleDiscountPercent
        }))
      }))
    },
    policyConstraints: {
      minimumMarginHurdlePercent: DEFAULT_MERCHANT_POLICY.minGrossMarginPercent,
      humanMandateThresholdInr: DEFAULT_MERCHANT_POLICY.mandateThresholdInr,
      dailyVelocityCapInr: DEFAULT_MERCHANT_POLICY.maxDailyTransactionCapInr
    }
  };
}
