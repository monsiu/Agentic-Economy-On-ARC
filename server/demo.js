require('dotenv').config();
const { ethers } = require('ethers');
const axios = require('axios');

const provider = new ethers.JsonRpcProvider(process.env.ARC_TESTNET_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const CONTRACT_ABI = [
  "function pay(string calldata endpoint) external",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function getStats() external view returns (uint256 calls, uint256 revenue, uint256 price)"
];

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const contract = new ethers.Contract(
  process.env.NANO_PAYMENT_CONTRACT,
  CONTRACT_ABI,
  wallet
);

const usdc = new ethers.Contract(
  '0x3600000000000000000000000000000000000000',
  USDC_ABI,
  wallet
);

async function approveUSDC() {
  console.log('Approving USDC spend...');
  const tx = await usdc.approve(
    process.env.NANO_PAYMENT_CONTRACT,
    ethers.parseUnits('10', 6) // approve 10 USDC
  );
  await tx.wait();
  console.log('USDC approved!');
}

async function makePaymentAndCall(index) {
  try {
    // 1. Pay on Arc
    const tx = await contract.pay('/ask', { gasLimit: 200000 });
    const receipt = await tx.wait();
    console.log(`[${index}] Payment tx: ${receipt.hash}`);

    // 2. Call API with tx hash
    const response = await axios.get('http://localhost:3000/ask', {
      params: { q: `What is nanopayment #${index}?` },
      headers: { 'x-payment-tx': receipt.hash }
    });

    console.log(`[${index}] API response: ${response.data.answer}`);
    return true;
  } catch (err) {
    console.error(`[${index}] Error: ${err.message}`);
    return false;
  }
}

async function runDemo() {
  console.log('Starting demo - 55 transactions on Arc...\n');

  // Approve USDC first
  await approveUSDC();

  // Fire 55 transactions
  let success = 0;
  for (let i = 1; i <= 55; i++) {
    const ok = await makePaymentAndCall(i);
    if (ok) success++;
    await new Promise(r => setTimeout(r, 1000)); // 1 second between calls
  }

  // Print final stats
  const [calls, revenue] = await contract.getStats();
  console.log(`\n✅ Demo complete!`);
  console.log(`Successful transactions: ${success}/55`);
  console.log(`Total onchain calls: ${calls}`);
  console.log(`Total revenue: ${Number(revenue) / 1e6} USDC`);
}

runDemo().catch(console.error);
