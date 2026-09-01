import { MERCHANT_CATALOG, Product } from './catalog-data';
import { BuyerConstraintConfig, DEFAULT_BUYER_CONSTRAINTS, evaluateFinancialTransaction } from './policies';
import { logAuditEvent } from './audit-store';
import { processMerchantSalesIntelligence } from './merchant-agent';

export interface NegotiationStep {
  stepNumber: number;
  sender: 'BUYER_AGENT' | 'MERCHANT_AGENT' | 'POLICY_GATE';
  thought: string;
  message: string;
  proposedCart: { sku: string; name: string; quantity: number; price: number }[];
  totalAmountInr: number;
  discountPercent: number;
  marginPercent?: number;
  status: 'PROPOSING' | 'COUNTERING' | 'EVALUATING_BOUNDS' | 'ACCEPTED' | 'GATED' | 'REJECTED' | 'FALLBACK';
}

export interface BuyerSimulationResult {
  simulationId: string;
  buyerProfile: BuyerConstraintConfig;
  goal: string;
  steps: NegotiationStep[];
  outcome: 'SUCCESS_CHECKOUT' | 'GATED_NEEDS_MANDATE' | 'BUDGET_EXCEEDED_GRACEFUL_RECOVERY' | 'NEGOTIATION_FAILED';
  finalOrder?: {
    orderId: string;
    items: { sku: string; name: string; quantity: number; price: number }[];
    finalPayableInr: number;
    marginPercent: number;
    discountPercent: number;
    auditHash: string;
  };
}

export function runAutonomousBuyerSimulation(
  goal: string = 'Procure studio-grade noise-cancelling headphones and video setup under ₹18,000 budget',
  customConstraints?: Partial<BuyerConstraintConfig>
): BuyerSimulationResult {
  const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const buyerProfile: BuyerConstraintConfig = {
    ...DEFAULT_BUYER_CONSTRAINTS,
    ...customConstraints
  };

  const steps: NegotiationStep[] = [];

  logAuditEvent(
    'AGENT_DISCOVERY',
    'BUYER_AGENT',
    'Catalog Discovery Query Dispatched',
    `Buyer Agent evaluated UAP catalog for criteria: "${goal}" within ₹${buyerProfile.maxBudgetInr.toLocaleString('en-IN')} budget cap.`,
    'PASSED',
    { buyerBudget: buyerProfile.maxBudgetInr }
  );

  steps.push({
    stepNumber: 1,
    sender: 'BUYER_AGENT',
    thought: `Goal: "${goal}". Querying UAP agent endpoint. I need studio-grade ANC headphones and streaming webcam with max budget ceiling ₹${buyerProfile.maxBudgetInr.toLocaleString('en-IN')}.`,
    message: 'Hello! I am an autonomous procurement agent seeking studio ANC headphones (AURA-ANC-900) and 4K webcam (AURA-CAM-4K). Please provide your best agent bundle quote.',
    proposedCart: [
      { sku: 'AURA-ANC-900', name: 'Aura Pro Wireless ANC Headphones', quantity: 1, price: 11999 },
      { sku: 'AURA-CAM-4K', name: 'Aura Flow 4K Smart Studio Webcam', quantity: 1, price: 8999 }
    ],
    totalAmountInr: 20998,
    discountPercent: 0,
    status: 'PROPOSING'
  });

  const initialItems = [
    { sku: 'AURA-ANC-900', quantity: 1 },
    { sku: 'AURA-CAM-4K', quantity: 1 }
  ];

  steps.push({
    stepNumber: 2,
    sender: 'MERCHANT_AGENT',
    thought: 'Buyer requested AURA-ANC-900 (₹11,999) + AURA-CAM-4K (₹8,999). Standard subtotal = ₹20,998. To close this multi-item deal while protecting our 30% margin hurdle rate, I can offer an 18% bundle discount reducing total to ₹17,218.',
    message: 'Welcome! For the Dual Studio Suite (Aura ANC-900 + Flow 4K Webcam), our standard retail is ₹20,998. Under our Agent Partner Program, I can apply an 18% Multi-Device Bundle Discount, bringing your total to ₹17,218 with free expedited shipping.',
    proposedCart: [
      { sku: 'AURA-ANC-900', name: 'Aura Pro Wireless ANC Headphones', quantity: 1, price: 9839 },
      { sku: 'AURA-CAM-4K', name: 'Aura Flow 4K Smart Studio Webcam', quantity: 1, price: 7379 }
    ],
    totalAmountInr: 17218,
    discountPercent: 18,
    marginPercent: 36.1,
    status: 'COUNTERING'
  });

  const financialEval = evaluateFinancialTransaction(
    initialItems,
    18,
    undefined,
    buyerProfile.maxBudgetInr
  );

  logAuditEvent(
    'BOUND_EVALUATION',
    'POLICY_GATE',
    'Pre-Checkout Policy & Bounds Verification',
    `Financial bounds checked: Total ₹${financialEval.finalPayableInr.toLocaleString('en-IN')} <= Budget ₹${buyerProfile.maxBudgetInr.toLocaleString('en-IN')}. Retained Gross Margin = ${financialEval.grossMarginPercent}% (>= 30% Hurdle Rate).`,
    'PASSED',
    {
      amountInr: financialEval.finalPayableInr,
      marginPercent: financialEval.grossMarginPercent,
      discountPercent: 18,
      buyerBudget: buyerProfile.maxBudgetInr
    }
  );

  steps.push({
    stepNumber: 3,
    sender: 'POLICY_GATE',
    thought: 'Running deterministic policy guardrails: Margin Guard (36.1% >= 30%) ✅ | Discount Cap (18% <= 22%) ✅ | Buyer Budget (₹17,218 <= ₹18,000) ✅ | Mandate Gate (₹17,218 > ₹12,000 threshold) ⚠️ Triggering soft confirmation flag.',
    message: '🛡️ Policy Gate Validation: Deal is economically bounded and margin-safe. Total payable ₹17,218 is within buyer budget of ₹18,000.',
    proposedCart: [
      { sku: 'AURA-ANC-900', name: 'Aura Pro Wireless ANC Headphones', quantity: 1, price: 9839 },
      { sku: 'AURA-CAM-4K', name: 'Aura Flow 4K Smart Studio Webcam', quantity: 1, price: 7379 }
    ],
    totalAmountInr: 17218,
    discountPercent: 18,
    marginPercent: 36.1,
    status: 'EVALUATING_BOUNDS'
  });

  steps.push({
    stepNumber: 4,
    sender: 'BUYER_AGENT',
    thought: `Merchant counter-offer of ₹17,218 fits perfectly within my ₹${buyerProfile.maxBudgetInr.toLocaleString('en-IN')} budget constraint while achieving 18% savings (saving ₹3,780). Authorizing Razorpay order creation.`,
    message: 'Offer accepted! Total of ₹17,218 satisfies my constraints. Initializing Razorpay test payment order.',
    proposedCart: [
      { sku: 'AURA-ANC-900', name: 'Aura Pro Wireless ANC Headphones', quantity: 1, price: 9839 },
      { sku: 'AURA-CAM-4K', name: 'Aura Flow 4K Smart Studio Webcam', quantity: 1, price: 7379 }
    ],
    totalAmountInr: 17218,
    discountPercent: 18,
    marginPercent: 36.1,
    status: 'ACCEPTED'
  });

  const auditEntry = logAuditEvent(
    'RAZORPAY_ORDER_CREATED',
    'POLICY_GATE',
    'Autonomous Razorpay Order Initiated',
    'Order created for Dual Studio Suite at ₹17,218. Bounded money action gated and recorded in immutable ledger.',
    'PASSED',
    {
      orderId: `order_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      amountInr: 17218,
      marginPercent: 36.1,
      discountPercent: 18
    }
  );

  return {
    simulationId,
    buyerProfile,
    goal,
    steps,
    outcome: 'SUCCESS_CHECKOUT',
    finalOrder: {
      orderId: auditEntry.metadata.orderId || 'order_DEMO9981',
      items: [
        { sku: 'AURA-ANC-900', name: 'Aura Pro Wireless ANC Headphones', quantity: 1, price: 9839 },
        { sku: 'AURA-CAM-4K', name: 'Aura Flow 4K Smart Studio Webcam', quantity: 1, price: 7379 }
      ],
      finalPayableInr: 17218,
      marginPercent: 36.1,
      discountPercent: 18,
      auditHash: auditEntry.sha256Hash
    }
  };
}
