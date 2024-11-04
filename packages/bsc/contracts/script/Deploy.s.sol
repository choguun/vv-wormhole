// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

import "../src/ETHDummy.sol";
import "../src/StakeStoneDummy.sol";
import "../src/StoneMinter.sol";
import "../src/StoneVault.sol";
import {GGP} from "../src/GGP.sol";
import "../src/FeesVault.sol";
import "../src/World.sol";
import "../src/Item.sol";
import "../src/Minter.sol";

contract Deploy is Script {
  function run() external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    ETHDummy eth = new ETHDummy();
    console.log("ETHDummy deployed at:", address(eth));

    StakeStoneDummy stakeStone = new StakeStoneDummy();
    console.log("StakeStoneDummy deployed at:", address(stakeStone));

    StoneMinter stoneMinter = new StoneMinter(address(stakeStone));
    console.log("StoneMinter deployed at:", address(stoneMinter));

    StoneVault stoneVault = new StoneVault(address(stoneMinter), address(eth));
    console.log("StoneVault deployed at:", address(stoneVault));

    address stakeStoneAddress = address(stakeStone);
    GGP ggp = new GGP(IERC20(stakeStoneAddress));
    console.log("GGP deployed at:", address(ggp));

    FeesVault feesVault = new FeesVault(address(ggp));
    console.log("FeesVault deployed at:", address(feesVault));

    World world = new World();
    console.log("World deployed at:", address(world));

    Item item = new Item(address(world));
    console.log("Item deployed at:", address(item));

    Minter minter = new Minter(address(ggp), address(stoneVault), address(stakeStone), address(eth));
    console.log("Minter deployed at:", address(minter));

    stakeStone.setNewMinter(address(stoneMinter));
    stoneMinter.setNewVault(address(stoneVault));

    world.config(address(ggp), address(item), address(feesVault));

    world.createItem(0, "NORMAL PICKAXE", "NORMAL PICKAXE", 100);
    world.createItem(1, "METAL PICKAXE", "METAL PICKAXE", 250);
    world.createItem(2, "GOLDEN PICKAXE", "GOLDEN PICKAXE", 600);

    vm.stopBroadcast();
  }
}