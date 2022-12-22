// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // state variable
    constructor() {
        console.log("Salom, World!");
    }

    function wave() public{
        totalWaves += 1;
        console.log("%s waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256){
        console.log("We have %d waves in total", totalWaves);
        return totalWaves;
    }
}