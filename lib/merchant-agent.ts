import { Product, getProductBySku, MERCHANT_CATALOG } from './catalog-data';
import { DEFAULT_MERCHANT_POLICY, evaluateFinancialTransaction, FinancialEvaluation } from './policies';
import { logAuditEvent } from './audit-store';

export interface MerchantAgentResponse {
  message: string;
  suggestedItems: Product[];
  proposedBundle?: {
    title: string;
    items: { sku: string; name: string; quantity: number; unitPrice: number }[];
    subtotal: number;
    bundleDiscountPercent: number;
    finalTotal: number;
    estimatedMarginPercent: number;
    savingsInr: number;
  };
  policyCheck: FinancialEvaluation;
  actions: Array<{
    label: string;
    actionType: 'ACCEPT_BUNDLE' | 'PROCEED_CHECKOUT' | 'COUNTER_OFFER' | 'REQUEST_HUMAN_MANDATE';
    payload: any;
  }>;
}

export function processMerchantSalesIntelligence(
  userQuery: string,
  currentCartSkus: string[] = [],
  buyerOfferDiscountPercent: number = 0,
  buyerBudget: number = 20000
): MerchantAgentResponse {
  const q = userQuery.toLowerCase();
  
  let matchedProducts: Product[] = [];
  if (currentCartSkus.length > 0) {
    matchedProducts = currentCartSkus
      .map(sku => getProductBySku(sku))
      .filter((p): p is Product => p !== undefined);
  } else {
    if (q.includes('headphone') || q.includes('anc') || q.includes('audio') || q.includes('sound')) {
      matchedProducts.push(getProductBySku('AURA-ANC-900')!);
    }
    if (q.includes('camera') || q.includes('webcam') || q.includes('video') || q.includes('stream')) {
      matchedProducts.push(getProductBySku('AURA-CAM-4K')!);
    }
    if (q.includes('keyboard') || q.includes('typing') || q.includes('desk') || q.includes('code')) {
      matchedProducts.push(getProductBySku('AURA-KB-MECH')!);
    }
    if (q.includes('mic') || q.includes('podcast') || q.includes('voice')) {
      matchedProducts.push(getProductBySku('AURA-MIC-PULSE')!);
    }
    if (matchedProducts.length === 0) {
      matchedProducts = [MERCHANT_CATALOG[0], MERCHANT_CATALOG[1]];
    }
  }

  const primaryProduct = matchedProducts[0] || MERCHANT_CATALOG[0];

  let upsellProduct: Product | undefined;
  if (primaryProduct.upsellAffinities.length > 0) {
    const affinity = primaryProduct.upsellAffinities[0];
    upsellProduct = getProductBySku(affinity.targetSku);
  }
  if (!upsellProduct && primaryProduct.sku !== 'AURA-CARE-2Y') {
    upsellProduct = getProductBySku('AURA-CARE-2Y');
  }

  const bundleItems = [{ sku: primaryProduct.sku, quantity: 1 }];
  if (upsellProduct) {
    bundleItems.push({ sku: upsellProduct.sku, quantity: 1 });
  }

  const discountForBundle = upsellProduct 
    ? Math.min(DEFAULT_MERCHANT_POLICY.maxBundleDiscountPercent, 18) 
    : Math.min(buyerOfferDiscountPercent, DEFAULT_MERCHANT_POLICY.maxSingleItemDiscountPercent);

  const financialEval = evaluateFinancialTransaction(
    bundleItems,
    discountForBundle,
    DEFAULT_MERCHANT_POLICY,
    buyerBudget
  );

  logAuditEvent(
    'UPSELL_PITCH',
    'MERCHANT_AGENT',
    `Autonomous Bundle Created for ${primaryProduct.name}`,
    `Merchant Agent generated a personalized bundle with ${upsellProduct?.name || 'Accessories'} offering ${discountForBundle}% bundle incentive while securing ${financialEval.grossMarginPercent}% gross margin.`,
    financialEval.isMarginSafe ? 'PASSED' : 'WARNING',
    {
      amountInr: financialEval.finalPayableInr,
      marginPercent: financialEval.grossMarginPercent,
      discountPercent: discountForBundle,
      buyerBudget
    }
  );

  const bundleTitle = upsellProduct 
    ? `🚀 Pro Studio Bundle: ${primaryProduct.name} + ${upsellProduct.name}` 
    : `⚡ Standard Offer: ${primaryProduct.name}`;

  const message = upsellProduct
    ? `I noticed you're interested in the **${primaryProduct.name}** (₹${primaryProduct.sellingPrice.toLocaleString('en-IN')}). To give you the maximum value while protecting our service warranty, I can bundle the **${upsellProduct.name}** with an exclusive **${discountForBundle}% bundle discount**! Total comes to **₹${financialEval.finalPayableInr.toLocaleString('en-IN')}** (Saving ₹${financialEval.discountAmountInr.toLocaleString('en-IN')}).`
    : `The **${primaryProduct.name}** is available at our special agent price of **₹${financialEval.finalPayableInr.toLocaleString('en-IN')}** with instant Razorpay test-mode checkout.`;

  return {
    message,
    suggestedItems: [primaryProduct, ...(upsellProduct ? [upsellProduct] : [])],
    proposedBundle: {
      title: bundleTitle,
      items: [
        {
          sku: primaryProduct.sku,
          name: primaryProduct.name,
          quantity: 1,
          unitPrice: primaryProduct.sellingPrice
        },
        ...(upsellProduct ? [{
          sku: upsellProduct.sku,
          name: upsellProduct.name,
          quantity: 1,
          unitPrice: upsellProduct.sellingPrice
        }] : [])
      ],
      subtotal: financialEval.subtotalSellingPrice,
      bundleDiscountPercent: discountForBundle,
      finalTotal: financialEval.finalPayableInr,
      estimatedMarginPercent: financialEval.grossMarginPercent,
      savingsInr: financialEval.discountAmountInr
    },
    policyCheck: financialEval,
    actions: [
      {
        label: `Accept Bundle & Checkout (₹${financialEval.finalPayableInr.toLocaleString('en-IN')})`,
        actionType: 'ACCEPT_BUNDLE',
        payload: {
          items: bundleItems,
          finalAmount: financialEval.finalPayableInr,
          discountPercent: discountForBundle
        }
      },
      {
        label: `Buy ${primaryProduct.name} Only (₹${primaryProduct.sellingPrice.toLocaleString('en-IN')})`,
        actionType: 'PROCEED_CHECKOUT',
        payload: {
          items: [{ sku: primaryProduct.sku, quantity: 1 }],
          finalAmount: primaryProduct.sellingPrice,
          discountPercent: 0
        }
      }
    ]
  };
}
