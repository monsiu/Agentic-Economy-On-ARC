// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NanoPayment.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NanoPayment nano = new NanoPayment(
            0x3600000000000000000000000000000000000000,
            1000
        );

        console.log("Deployed to:", address(nano));
        vm.stopBroadcast();
    }
}
