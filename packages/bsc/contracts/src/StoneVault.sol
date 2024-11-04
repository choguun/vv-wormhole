// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {StoneMinter} from "./StoneMinter.sol";
import {ETHDummy} from "./ETHDummy.sol";

contract StoneVault {
    // External contracts
    address public minter;
    address public eth;
    // External contracts

    constructor(address _minter, address _eth) {
        minter = _minter;
        eth = _eth;
    }
    
    function mint(address _to, uint256 _amount) external {
        require(ETHDummy(eth).balanceOf(msg.sender) >= _amount, "not enough balance");
        require(ETHDummy(eth).approve(address(this), _amount));
        
        ETHDummy(eth).transferFrom(msg.sender, address(this), _amount);

        StoneMinter(minter).mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) external {
        StoneMinter(minter).burn(_from, _amount);
    }
}