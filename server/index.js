require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const { askGemini } = require('./agent');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const provider = new ethers.JsonRpcProvider(process.env.ARC_TESTNET_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const CONTRACT_ABI = [
  "function pay(string calldata endpoint) external",
  "function getStats() external view returns (uint256 calls, uint256 revenue, uint256 price)",
  "event PaymentReceived(address indexed payer, uint256 amount, uint256 callNumber, string endpoint, uint256 timestamp)"
];

const contract = new ethers.Contract(
  process.env.NANO_PAYMENT_CONTRACT,
  CONTRACT_ABI,
  provider
);

async function verifyPayment(req, res, next) {
  const txHash = req.headers['x-payment-tx'];
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment required',
      message: 'Include x-payment-tx header with your transaction hash',
      price: '$0.001 USDC per request'
    });
  }
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status !== 1) {
      return res.status(402).json({ error: 'Invalid or pending transaction' });
    }
    req.payer = receipt.from;
    next();
  } catch (err) {
    return res.status(402).json({ error: 'Could not verify payment' });
  }
}

app.get('/stats', async (req, res) => {
  try {
    const [calls, revenue, price] = await contract.getStats();
    res.json({
      totalCalls: calls.toString(),
      totalRevenue: (Number(revenue) / 1e6).toFixed(4) + ' USDC',
      pricePerCall: (Number(price) / 1e6).toFixed(4) + ' USDC',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/ask', verifyPayment, async (req, res) => {
  const question = req.query.q || 'What is the Agentic Economy?';
  try {
    const answer = await askGemini(question);
    res.json({
      answer,
      payer: req.payer,
      timestamp: new Date().toISOString(),
      model: 'gemini-2.0-flash',
      cost: '$0.001 USDC'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/demo-ask', async (req, res) => {
  const question = req.query.q || 'What is the agentic economy?';
  try {
    const answer = await askGemini(question);
    res.json({
      answer,
      model: 'gemini-2.0-flash',
      cost: '$0.001 USDC',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Contract: ${process.env.NANO_PAYMENT_CONTRACT}`);
});