// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

import {GGP} from "./GGP.sol";
import {StakeStoneDummy} from "./StakeStoneDummy.sol";
import {StoneVault} from "./StoneVault.sol";
import {ETHDummy} from "./ETHDummy.sol";

contract Minter is Ownable {
    enum tokenType {
        Native,
        LST
    }

    // External contracts
    address public ggp;
    address public stoneVault;
    address public stone;
    address public eth;
    // External contracts

    constructor(address _ggp, address _stoneVault, address _stone, address _eth) Ownable(_msgSender()) {
        ggp = _ggp;
        stoneVault = _stoneVault;
        stone = _stone;
        eth = _eth;
    }

    function mint(uint256 _amount, tokenType _type) external onlyOwner {
        require(_amount > 0, "amount must be greater than 0");

        if (_type == tokenType.Native) {
            require(ETHDummy(eth).balanceOf(_msgSender()) >= _amount, "ETH is not enough");

            // ETH Dummy token is ERC20 it should be native for real case
            ETHDummy(eth).approve(address(this), _amount);
            ETHDummy(eth).transferFrom(_msgSender(), address(this), _amount);
            StoneVault(stoneVault).mint(_msgSender(), _amount);
        }
        require(StakeStoneDummy(stone).balanceOf(_msgSender()) >= _amount, "Stone is not enough");

        StakeStoneDummy(stone).approve(address(this), _amount);
        StakeStoneDummy(stone).transferFrom(_msgSender(), address(this), _amount);
        GGP(ggp).deposit(_amount, _msgSender());
    }
    // TODO: minter mint GP by StakeStoneDummy token by call deposit GP contract
}