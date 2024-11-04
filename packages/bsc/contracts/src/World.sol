// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

import {GGP} from "./GGP.sol";
import {Item} from "./Item.sol";
import {FeesVault} from "./FeesVault.sol";

contract World is Ownable {
    // Data Structures
    enum ExchangeType {
        BUY,
        SELL
    }
    struct GameItem {
        string name;
        string description;
        uint256 price;
    }
    // Data Structures

    // World State
    mapping(uint16 => GameItem) public items;
    // World State

    // External contracts
    address public ggp;
    address public item;
    address public feesVault;
    // External contracts

    uint256 public itemCount = 0;

    uint256 public constant DENOMINATOR = 10 ** 18;
    uint256 public marketfees = 20; // 20%
    uint256 public platformfees = 5; // 5%

    // constructor
    constructor() Ownable(_msgSender()) {}
    // constructor

    // config
    function config(address _ggp, address _item, address _feesVault) external onlyOwner {
        ggp = _ggp;
        item = _item;
        feesVault = _feesVault;
    }
    // config

    // Events
    event GameItemCreated(
        uint256 itemId,
        uint256 price,
        uint256 timestamp
    );
     event GameItemUpdated(
        uint256 itemId,
        uint256 price,
        uint256 timestamp
    );
    // Events

    // player function
    function exchangeItem(uint16 _itemId, ExchangeType _exchangeType) external {
        uint256 price = _getItemPrice(_itemId);
        if(_exchangeType == ExchangeType.BUY) {
            // Buy the item
            require(GGP(ggp).balanceOf(_msgSender()) >= price, "Insufficient balance");
            require(GGP(ggp).approve(address(this), price), "Approve failed");
            
            GGP(ggp).transferFrom(_msgSender(), address(this), price);
            GGP(ggp).transfer(feesVault, (price * platformfees) / 100);
            Item(item).mint(_msgSender(), _itemId, 1);
        } else {
            // Sell the item
            require(Item(item).balanceOf(_msgSender(), _itemId) > 0, "Insufficient item");
            Item(item).burn(_msgSender(), _itemId, 1);
            GGP(ggp).transfer(_msgSender(), (price * (100 - (marketfees + platformfees))) / 100);
        }
    }

    function _getItemPrice(uint16 _itemId) internal view returns(uint256) {
        return items[_itemId].price * DENOMINATOR;
    }
    // player function

    // admin functions
    function createItem(uint16 _itemId, string memory _name, string memory _description, uint256 _price) public onlyOwner {
        items[_itemId] = GameItem(_name, _description, _price);
        emit GameItemCreated(_itemId, _price, block.timestamp);
        itemCount++;
    }
    // admin functions
}