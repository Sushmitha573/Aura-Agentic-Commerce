# Aura: Autonomous Merchant Growth Engine & NPCI UAP Agentic Gateway on Razorpay

> **Track:** AI Growth & Agentic Commerce  
> **Mission:** Grow the merchant’s revenue, and make them transactable by AI buyers end to end on Razorpay test-mode APIs.

---

## 🚀 Key Highlights & Capabilities

1. **Autonomous AI Buyer Arena (A2A Commerce)**
   - Exposes standard discovery schema at `/.well-known/agent-protocol.json` adhering to **NPCI UAP 1.0** and **AP2** specifications.
   - Autonomous multi-turn negotiation between AI Buyer agents and Merchant Growth agents.
   - Transparent, real-time reasoning traces showing pricing, margin evaluation, and agreement convergence.

2. **Conversational In-App Checkout & Upsell Copilot**
   - Natural language product matching that builds high-margin complementary product bundles.
   - **+28.4% Average Order Value (AOV) Lift** with automated gross margin hurdle protection ($\ge 30\%$).
   - Seamless 1-click Razorpay test modal with UPI QR (`success@razorpay`) and card rails.

3. **Autonomous Revenue Campaign Orchestrator**
   - Intercepts checkout drop-offs and dispatches 15-minute price-locked **Razorpay Smart Payment Links** (`https://rzp.io/i/...`) to recover lost GMV.

4. **The Bar: Explainable, Bounded & Gated Money Actions**
   - Deterministic policy guardrails:
     - **Minimum Gross Margin Hurdle Rate:** 30.0%
     - **Max Bundle Discount Cap:** 22.0%
     - **Human Mandate Threshold:** $\ge ₹12,000$ (triggers soft approval flag)
   - Cryptographic **SHA-256 Decision Audit Ledger** with mathematical explainability breakdown.

5. **Chaos & Resilience Demonstration Lab**
   - **Scenario 1 (Payment Gateway Decline):** Intercepts gateway timeout and recovers via Razorpay Smart Payment Link.
   - **Scenario 2 (Buyer Budget Breach):** Dynamically rebalances bundle without sacrificing merchant margin.
   - **Scenario 3 (Stock Depletion):** Semantic SKU substitution with goodwill discount.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & App Framework:** Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti
- **Agent Protocol Standards:** NPCI UAP 1.0, AP2 HTTP flow, Model Context Protocol (MCP) JSON schemas
- **Payment Rails:** Razorpay Test-Mode APIs (Orders, Payment Links, HMAC-SHA256 Signatures, Webhooks)
- **Security & Integrity:** SHA-256 Decision Hashing, Deterministic Policy Guardrails

---

## 🚦 Getting Started

```bash
# 1. Clone repository
git clone https://github.com/Sushmitha573/Aura-Agentic-Commerce.git
cd Aura-Agentic-Commerce

# 2. Install dependencies
npm install

# 3. Run production build / server
npm run build
npm start
```

- **Web Application:** [http://localhost:3000](http://localhost:3000)
- **Discovery Endpoint:** [http://localhost:3000/.well-known/agent-protocol.json](http://localhost:3000/.well-known/agent-protocol.json)
