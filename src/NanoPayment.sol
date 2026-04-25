// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract NanoPayment {
    address public owner;
    IERC20 public usdc;
    uint256 public pricePerCall; // in USDC (6 decimals)
    uint256 public totalCalls;
    uint256 public totalRevenue;

    event PaymentReceived(
        address indexed payer,
        uint256 amount,
        uint256 callNumber,
        string endpoint,
        uint256 timestamp
    );

    event Withdrawal(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _usdc, uint256 _pricePerCall) {
        owner = msg.sender;
        usdc = IERC20(_usdc);
        pricePerCall = _pricePerCall;
    }

    function pay(string calldata endpoint) external {
        require(
            usdc.transferFrom(msg.sender, address(this), pricePerCall),
            "Payment failed"
        );

        totalCalls++;
        totalRevenue += pricePerCall;

        emit PaymentReceived(
            msg.sender,
            pricePerCall,
            totalCalls,
            endpoint,
            block.timestamp
        );
    }

    function getStats() external view returns (
        uint256 calls,
        uint256 revenue,
        uint256 price
    ) {
        return (totalCalls, totalRevenue, pricePerCall);
    }

    function withdraw() external onlyOwner {
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "Nothing to withdraw");
        usdc.transfer(owner, balance);
        emit Withdrawal(owner, balance);
    }

    function updatePrice(uint256 _newPrice) external onlyOwner {
        pricePerCall = _newPrice;
    }
}
