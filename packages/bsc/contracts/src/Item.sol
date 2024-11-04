// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";

contract Item is ERC1155, Ownable {
    uint256 public constant PICKAXE = 0;
    uint256 public constant METAL_PICKAXE = 1;
    uint256 public constant GOLDEN_PICKAXE = 2;

    address public world;

    constructor(address _world) 
    ERC1155("")
    Ownable(_msgSender())
    {
        world = _world;
    }

    modifier onlyWorld() {
        require(_msgSender() == world, "Only world can call this function");
        _;
    }

    function mint(address _to, uint256 _id, uint256 _amount) public onlyWorld {
        _mint(_to, _id, _amount, "");
    }

    function burn(address _to, uint256 _id, uint256 _amount) public onlyWorld {
        _burn(_to, _id, _amount);
    }
}
