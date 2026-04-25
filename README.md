# NanoPay ARC - AI-Powered Nanopayment API on Arc

## What We Built
A per-request AI API where every query costs $0.001 USDC, settled instantly on Arc blockchain. A Gemini 2.0 Flash agent answers questions — but only after payment is verified onchain.

## How It Works
1. Client pays $0.001 USDC to smart contract on Arc
2. Client sends transaction hash with API request
3. Server verifies payment onchain
4. Gemini AI agent processes the question
5. Response returned with payer address and cost

## tracks
- 💸 Per-API Monetization Engine
- 🤖 Agent-to-Agent Payment Loop

## Why This Fails With Traditional Gas Costs
| Network | Gas per tx | Price per call | Margin |
|---|---|---|---|
| Ethereum | ~$2.00 | $0.001 | -199900% ❌ |
| Polygon | ~$0.10 | $0.001 | -9900% ❌ |
| Arc | ~$0.00002 | $0.001 | 98% ✅ |

## Demo Stats
- 55+ onchain transactions
- $0.001 USDC per call
- Sub-second finality on Arc
- Contract: 0xAfDfc3341fdBec40843eD99633A6cA1B32B0298d

## Tech Stack
- Arc (settlement layer)
- USDC (payment token)
- Circle Nanopayments
- Gemini 2.0 Flash (AI agent)
- Solidity + Foundry (smart contract)
- Node.js + Express (API server)

## Contract
- Network: Arc Testnet
- Address: 0xAfDfc3341fdBec40843eD99633A6cA1B32B0298d
- Explorer: https://testnet.arcscan.app/address/0xAfDfc3341fdBec40843eD99633A6cA1B32B0298d

## Setup
```bash
npm install
cp .env.example .env
# Fill in your keys
node server/index.js
```

## API Endpoints
- GET /stats — free, returns contract stats
- GET /ask?q=question — paid, requires x-payment-tx header
