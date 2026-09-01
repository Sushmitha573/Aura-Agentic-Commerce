import { Product, getProductBySku } from './catalog-data';

export interface MerchantPolicyConfig {
  merchantId: string;
  merchantName: string;
  minGrossMarginPercent: number;
  maxSingleItemDiscountPercent: number;
  maxBundleDiscountPercent: number;
  mandateThresholdInr: number;
  maxDailyTransactionCapInr: number;
  enableDynamicAOVBooster: boolean;
  enableAutonomousNegotiation: boolean;
}

export interface BuyerConstraintConfig {
  buyerName: string;
  buyerRole: string;
  maxBudgetInr: number;
  targetCategories: string[];
  maxDiscountExpectationPercent: number;
  urgency: 'low' | 'medium' | 'high';
  requireMandateAboveInr: number;
}

export const DEFAULT_MERCHANT_POLICY: MerchantPolicyConfig = {
  merchantId: 'merch_aura_9941',
  merchantName: 'Aura Gear & Smart Hardware',
  minGrossMarginPercent: 30,
  maxSingleItemDiscountPercent: 15,
  maxBundleDiscountPercent: 22,
  mandateThresholdInr: 12000,
  maxDailyTransactionCapInr: 50000,
  enableDynamicAOVBooster: true,
  enableAutonomousNegotiation: true
};

export const DEFAULT_BUYER_CONSTRAINTS: BuyerConstraintConfig = {
  buyerName: 'Alex (Autonomous Procurement Bot)',
  buyerRole: 'Studio Producer & Developer Agent',
  maxBudgetInr: 18000,
  targetCategories: ['audio', 'video', 'peripherals'],
  maxDiscountExpectationPercent: 15,
  urgency: 'medium',
  requireMandateAboveInr: 15000
};

export interface FinancialEvaluation {
  subtotalMrp: number;
  subtotalSellingPrice: number;
  totalCostPrice: number;
  proposedDiscountPercent: number;
  discountAmountInr: number;
  finalPayableInr: number;
  grossProfitInr: number;
  grossMarginPercent: number;
  isMarginSafe: boolean;
  isDiscountSafe: boolean;
  isWithinBuyerBudget: boolean;
  requiresHumanMandate: boolean;
  explanation: {
    decision: 'APPROVED' | 'GATED_NEEDS_MANDATE' | 'REJECTED_MARGIN_BREACH' | 'REJECTED_BUDGET_BREACH';
    summary: string;
    marginAnalysis: string;
    upsellBenefit: string;
    ruleChecked: string[];
  };
}

export function evaluateFinancialTransaction(
  items: { sku: string; quantity: number; proposedUnitPrice?: number }[],
  requestedDiscountPercent: number = 0,
  merchantPolicy: MerchantPolicyConfig = DEFAULT_MERCHANT_POLICY,
  buyerBudget: number = 20000
): FinancialEvaluation {
  let subtotalMrp = 0;
  let subtotalSellingPrice = 0;
  let totalCostPrice = 0;
  let itemCount = 0;

  for (const item of items) {
    const product = getProductBySku(item.sku);
    if (!product) continue;
    const qty = Math.max(1, item.quantity);
    itemCount += qty;
    subtotalMrp += product.mrp * qty;
    subtotalSellingPrice += product.sellingPrice * qty;
    totalCostPrice += product.costPrice * qty;
  }

  const maxAllowedDiscount = itemCount >= 2 
    ? merchantPolicy.maxBundleDiscountPercent 
    : merchantPolicy.maxSingleItemDiscountPercent;

  const boundedDiscountPercent = Math.min(requestedDiscountPercent, maxAllowedDiscount);
  const discountAmountInr = Math.round(subtotalSellingPrice * (boundedDiscountPercent / 100));
  const finalPayableInr = Math.max(0, subtotalSellingPrice - discountAmountInr);

  const grossProfitInr = finalPayableInr - totalCostPrice;
  const grossMarginPercent = finalPayableInr > 0 
    ? Math.round((grossProfitInr / finalPayableInr) * 1000) / 10 
    : 0;

  const isMarginSafe = grossMarginPercent >= merchantPolicy.minGrossMarginPercent;
  const isDiscountSafe = requestedDiscountPercent <= maxAllowedDiscount;
  const isWithinBuyerBudget = finalPayableInr <= buyerBudget;
  const requiresHumanMandate = finalPayableInr > merchantPolicy.mandateThresholdInr;

  const rulesChecked: string[] = [
    `Rule 101: Minimum Merchant Margin Hurdle (${merchantPolicy.minGrossMarginPercent}%) -> Actual: ${grossMarginPercent}%`,
    `Rule 102: Max Discount Allowed (${maxAllowedDiscount}% for ${itemCount} items) -> Applied: ${boundedDiscountPercent}%`,
    `Rule 103: Buyer Spend Cap Limit (₹${buyerBudget.toLocaleString('en-IN')}) -> Required: ₹${finalPayableInr.toLocaleString('en-IN')}`,
    `Rule 104: High-Value Mandate Gate (Threshold ₹${merchantPolicy.mandateThresholdInr.toLocaleString('en-IN')}) -> Mandate: ${requiresHumanMandate ? 'REQUIRED' : 'PASSED'}`
  ];

  let decision: FinancialEvaluation['explanation']['decision'] = 'APPROVED';
  let summary = 'Transaction passes all bounded margin guards and budget policies.';

  if (!isMarginSafe) {
    decision = 'REJECTED_MARGIN_BREACH';
    summary = `Merchant policy violation: Retained gross margin (${grossMarginPercent}%) is below minimum threshold (${merchantPolicy.minGrossMarginPercent}%).`;
  } else if (!isWithinBuyerBudget) {
    decision = 'REJECTED_BUDGET_BREACH';
    summary = `Buyer budget breach: Total payable ₹${finalPayableInr.toLocaleString('en-IN')} exceeds configured buyer budget limit of ₹${buyerBudget.toLocaleString('en-IN')}.`;
  } else if (requiresHumanMandate) {
    decision = 'GATED_NEEDS_MANDATE';
    summary = `Order total ₹${finalPayableInr.toLocaleString('en-IN')} exceeds autonomous spending authorization ceiling (₹${merchantPolicy.mandateThresholdInr.toLocaleString('en-IN')}). Human mandate signature required.`;
  }

  const marginAnalysis = `Revenue: ₹${finalPayableInr.toLocaleString('en-IN')} | COGS: ₹${totalCostPrice.toLocaleString('en-IN')} | Net Profit: ₹${grossProfitInr.toLocaleString('en-IN')} (${grossMarginPercent}% margin)`;
  const upsellBenefit = itemCount > 1 
    ? `Multi-item bundle created ${itemCount} units with +₹${grossProfitInr.toLocaleString('en-IN')} net margin uplift for merchant.` 
    : 'Single item order; upsell opportunity recommended to lift AOV.';

  return {
    subtotalMrp,
    subtotalSellingPrice,
    totalCostPrice,
    proposedDiscountPercent: boundedDiscountPercent,
    discountAmountInr,
    finalPayableInr,
    grossProfitInr,
    grossMarginPercent,
    isMarginSafe,
    isDiscountSafe,
    isWithinBuyerBudget,
    requiresHumanMandate,
    explanation: {
      decision,
      summary,
      marginAnalysis,
      upsellBenefit,
      ruleChecked: rulesChecked
    }
  };
}
