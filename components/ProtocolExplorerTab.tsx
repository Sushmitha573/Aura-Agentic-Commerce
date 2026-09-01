'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  Copy, 
  Check, 
  ExternalLink
} from 'lucide-react';

export const ProtocolExplorerTab: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'UAP_SCHEMA' | 'AP2_HEADERS' | 'MCP_TOOLS'>('UAP_SCHEMA');
  const [copied, setCopied] = useState(false);

  const uapSchemaCode = `{
  "protocol": "NPCI_UAP/1.0",
  "merchant": {
    "id": "merch_aura_9941",
    "name": "Aura Gear & Smart Hardware",
    "endpoint": "https://merchant.aura.internal/api/agent",
    "supportedCurrencies": ["INR"],
    "supportedPaymentRails": ["RAZORPAY_UPI", "RAZORPAY_CARD", "RAZORPAY_SMART_PAYMENT_LINK"],
    "agenticCapabilities": {
      "autonomousNegotiation": true,
      "dynamicBundling": true,
      "instantCheckout": true,
      "x402MicroPayments": true
    }
  },
  "catalog": {
    "version": "2026.08.30-v1",
    "itemCount": 7,
    "items": [
      {
        "sku": "AURA-ANC-900",
        "title": "Aura Pro Wireless ANC Headphones",
        "pricing": {
          "currency": "INR",
          "mrp": 14999,
          "standardPrice": 11999,
          "floorPrice": 8500,
          "maxAutoNegotiateDiscountPercent": 15
        },
        "inventory": { "available": 28, "status": "IN_STOCK" },
        "bundleAffinities": [
          { "sku": "AURA-PWR-100", "discountIncentivePercent": 15 },
          { "sku": "AURA-CARE-2Y", "discountIncentivePercent": 20 }
        ]
      }
    ]
  },
  "policyConstraints": {
    "minimumMarginHurdlePercent": 30,
    "humanMandateThresholdInr": 12000,
    "dailyVelocityCapInr": 50000
  }
}`;

  const ap2HeadersCode = `// Standard HTTP AP2 & x402 Header Negotiation Example
POST /api/agent/quote HTTP/1.1
Host: localhost:3000
X-Agent-Protocol: NPCI_UAP/1.0
X-Agent-Identity: agent_nexus_buyer_992
X-Agent-Budget-Cap: 18000
X-Payment-Rails: RAZORPAY_TEST_SANDBOX
Content-Type: application/json

{
  "items": [
    { "sku": "AURA-ANC-900", "quantity": 1 },
    { "sku": "AURA-CAM-4K", "quantity": 1 }
  ],
  "proposedDiscountPercent": 15
}

// HTTP 402 / 200 Response with Bounded Signed Quote:
HTTP/1.1 200 OK
X-UAP-Decision: APPROVED
X-Retained-Gross-Margin: 36.1%
X-Decision-Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Content-Type: application/json`;

  const mcpToolsCode = `{
  "tools": [
    {
      "name": "search_merchant_catalog",
      "description": "Searches merchant catalog using semantic tags, category filters, and specs.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "category": { "type": "string", "enum": ["audio", "video", "peripherals", "power", "services", "all"] }
        },
        "required": ["query"]
      }
    },
    {
      "name": "request_agent_quote",
      "description": "Requests margin-aware dynamic bundle quote with discount calculation.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": { "type": "object", "properties": { "sku": { "type": "string" }, "quantity": { "type": "number" } } }
          },
          "proposedDiscountPercent": { "type": "number" }
        },
        "required": ["items"]
      }
    },
    {
      "name": "execute_bounded_checkout",
      "description": "Dispatches Razorpay test-mode payment order with cryptographic audit hash.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "quoteId": { "type": "string" },
          "customerInfo": { "type": "object" }
        },
        "required": ["quoteId"]
      }
    }
  ]
}`;

  const currentCode = 
    selectedFormat === 'UAP_SCHEMA' ? uapSchemaCode :
    selectedFormat === 'AP2_HEADERS' ? ap2HeadersCode : mcpToolsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 mb-3">
              <Radio className="w-3.5 h-3.5" />
              Machine-to-Machine Commerce Standard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Agent Protocols: NPCI UAP, AP2 & MCP Tool Specs
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              This platform exposes live, standardized agent endpoints. External AI buyer agents can query catalog metadata via <code className="text-blue-400 bg-slate-950 px-1 py-0.5 rounded font-mono">/.well-known/agent-protocol.json</code> and execute bounded transactions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/.well-known/agent-protocol.json"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span>View Raw UAP JSON</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFormat('UAP_SCHEMA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedFormat === 'UAP_SCHEMA'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              NPCI UAP Schema
            </button>
            <button
              onClick={() => setSelectedFormat('AP2_HEADERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedFormat === 'AP2_HEADERS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              AP2 / x402 HTTP Flow
            </button>
            <button
              onClick={() => setSelectedFormat('MCP_TOOLS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedFormat === 'MCP_TOOLS'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              Model Context Protocol (MCP)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
          </button>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
          <pre className="font-mono text-xs text-blue-300 leading-relaxed">
            {currentCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
