# NanoPay — AI-Powered Nanopayment API on Arc

> The $0.001 AI Economy. Every query costs one tenth of a cent, settled instantly on Arc blockchain using USDC.

## 🔴 Live Demo
- **Frontend:** https://agentic-economy-on-arc-production.up.railway.app
- **Live Stats (JSON):** https://agentic-economy-on-arc-production.up.railway.app/stats

## What We Built
A per-request AI API where every query costs $0.001 USDC, settled instantly on Arc blockchain. A Gemini 2.0 Flash agent answers questions — but only after payment is verified onchain.

## How It Works
1. Client pays $0.001 USDC to smart contract on Arc
2. Client sends transaction hash with API request
3. Server verifies payment onchain
4. Gemini AI agent processes the question
5. Response returned with payer address and cost

## Tracks
- 🪙 Per-API Monetization Engine
- 🤖 Agent-to-Agent Payment Loop

## Why This Fails With Traditional Gas Costs
| Network | Gas per tx | Price per call | Margin |
|---|---|---|---|
| Ethereum | ~$2.00 | $0.001 | -199,900% ❌ |
| Polygon | ~$0.10 | $0.001 | -9,900% ❌ |
| **Arc** | ~$0.00002 | $0.001 | **98% ✅** |

Sub-cent pricing is only economically viable on Arc. Traditional chains destroy margins before a single response is returned.

## Demo Stats
- **57+ onchain transactions** verified on Arc
- **$0.001 USDC** per call
- **Sub-second finality** on Arc
- **98% gross margin** at $0.001 pricing
- **Contract:** 0xAfDfc3341fdBec40843eD99633A6cA1B32B0298d

## API Endpoints

| Endpoint | Auth | Description |
|---|---|---|
| `GET /` | None | Frontend UI |
| `GET /stats` | None | Live contract stats from Arc |
| `GET /ask?q=question` | x-payment-tx header | Paid AI response via Gemini |
| `GET /demo-ask?q=question` | None | Demo endpoint for frontend |

### Example: Check Live Stats
```bash
curl https://agentic-economy-on-arc-production.up.railway.app/stats
```
Returns:
```json
{
  "totalCalls": "57",
  "totalRevenue": "0.0570 USDC",
  "pricePerCall": "0.0010 USDC"
}
```

### Example: Paid Request
```bash
curl "https://agentic-economy-on-arc-production.up.railway.app/ask?q=What+is+the+agentic+economy?" \
  -H "x-payment-tx: 0xYOURTXHASH"
```

## Tech Stack
- **Arc** — EVM-compatible L1 blockchain, settlement layer
- **USDC** — Native payment token on Arc
- **Circle Nanopayments** — Sub-cent transaction infrastructure
- **Gemini 2.0 Flash** — AI agent for intelligent responses
- **Solidity + Foundry** — Smart contract development
- **Node.js + Express** — API server

## Contract
- **Network:** Arc Testnet
- **Address:** 0xAfDfc3341fdBec40843eD99633A6cA1B32B0298d
- **Explorer:** https://testnet.arcscan.app/address/0xAfDfc3341fdBec40843eD99633A6cA1B32B0298d

## Setup
```bash
npm install
cp .env.example .env
# Fill in your keys
node server/index.js
```