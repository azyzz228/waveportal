// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // state variable

    mapping (address => uint104) public waveChart; // to store who waved most

    constructor() {
        console.log("Salom, World!");
    }

    function wave() public {
        totalWaves += 1;
        uint104 waver = waveChart[msg.sender];
        waver += 1;
        waveChart[msg.sender] = waver;
        console.log("%s waved!", msg.sender);
        console.log("%s waved in total %d times", msg.sender, waveChart[msg.sender]);
    }

    function getTotalWaves() public view returns (uint256){
        console.log("We have %d waves in total", totalWaves);
        return totalWaves;
    }
}