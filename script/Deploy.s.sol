// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

import "../src/World.sol";
import "../src/Profile.sol";
import {Token} from "../src/Token.sol";
import "../src/Item.sol";
import "../src/CraftSystem.sol";
import {ERC4626Vault} from "../src/ERC4626Vault.sol";

contract Deploy is Script {
  function run() external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    address owner = msg.sender;

    address wormholeRelayer = address(0);
    address tokenBridge = address(0);
    address wormhole = address(0);

    World world = new World(wormholeRelayer, tokenBridge, wormhole, owner);
    console.log("World deployed at:", address(world));

    Profile profile = new Profile(address(world));
    console.log("Profile deployed at:", address(profile));

    CraftSystem craft = new CraftSystem(owner, address(world));
    console.log("CraftSystem deployed at:", address(craft));

    Item item = new Item(address(owner), address(world), address(craft), "");
    console.log("Item deployed at:", address(item));

    Token token = new Token(wormholeRelayer, tokenBridge, wormhole, owner, address(profile), address(world));
    console.log("Token deployed at:", address(token));

    Potion potion = new Potion(owner, address(world), "");
    console.log("Potion deployed at:", address(potion));

    ERC4626Vault vault = new ERC4626Vault(IERC20(address(token)));
    console.log("Vault deployed at:", address(vault));

    world.setProfile(address(profile));
    world.setItem(address(item));
    world.setPotion(address(potion));
    world.setCraft(address(craft));
    world.setToken(address(token));
    world.setVault(address(vault));

    world.createItem(0, "NORMAL PICKAXE", "NORMAL PICKAXE", 100);
    world.createItem(1, "METAL PICKAXE", "METAL PICKAXE", 250);
    world.createItem(2, "GOLDEN PICKAXE", "GOLDEN PICKAXE", 600);

    world.createQuest("dailyCheckIn", "Daily Check In", 250, World.QuestType(0));
    world.createQuest("miniGame", "Play mini game", 500, World.QuestType(1));
    world.createQuest("doCraft", "Do Craft", 300, World.QuestType(2));

    world.addItems(0, CraftSystem.ItemType(0));
    world.addItems(1, CraftSystem.ItemType(1));
    world.addItems(2, CraftSystem.ItemType(2));

    world.addRecipe(new uint256[](0), new uint256[](2), 1);
    world.addRecipe(new uint256[](1), new uint256[](2), 2);

    vm.stopBroadcast();
  }
}