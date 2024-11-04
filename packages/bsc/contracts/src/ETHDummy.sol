// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "solmate/tokens/ERC20.sol";

contract ETHDummy is ERC20 {
    constructor() ERC20("ETHDummy", "ETHDummy", 18) {}

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) public {
        _burn(msg.sender, _amount);
    }
}