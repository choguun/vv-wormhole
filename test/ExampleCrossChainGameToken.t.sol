// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Token} from "../src/Token.sol";

import "wormhole-solidity-sdk/testing/WormholeRelayerTest.sol";

import "forge-std/Test.sol";
import "forge-std/console.sol";

contract ExampleCrossChainGameTokenTest is WormholeRelayerTest {
    
    // Hub chain is Celo Testnet
    uint16 constant hubChain = 14;

    // Spoke chains are BSC, Polygon, and Avalanche Testnets
    uint16[] spokeChains = [4, 5, 6];

    // Hub public hub;
    // mapping(uint16 => Spoke) spokes;

    mapping(uint16 => ERC20Mock) public tokens;

    constructor() WormholeRelayerTest() {
        ChainInfo[] memory chains = new ChainInfo[](spokeChains.length + 1);

        chains[0] = chainInfosTestnet[hubChain];

        for(uint256 i=0; i<spokeChains.length; i++) {
            chains[i+1] = chainInfosTestnet[spokeChains[i]];
        }

        setActiveForks(chains);
    }

    function selectChain(uint16 chain) public {
        vm.selectFork(activeForks[chain].fork);
    }

    function setUpFork(ActiveFork memory fork) public override {

    }
}
