// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // state variable

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // address of user that waived
        string message; // msg that was sent
        uint256 timestamp; // Timestamp of Wave
    }

    // Array of structs Wave
    Wave[] waves;

    // mapping (address => uint104) public waveChart; // to store who waved most

    constructor() {
        console.log("Salom, World!");
    }

    function wave(string memory _message) public {
        totalWaves += 1;

        console.log("%s waved w/ msg %s", msg.sender, _message);

        // store data in array
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);

        // uint104 waver = waveChart[msg.sender];
        // waver += 1;
        // waveChart[msg.sender] = waver;
        // console.log("%s waved!", msg.sender);
        // console.log("%s waved in total %d times", msg.sender, waveChart[msg.sender]);
    }

    function getAllWaves() public view returns(Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256){
        console.log("We have %d waves in total", totalWaves);
        return totalWaves;
    }
}