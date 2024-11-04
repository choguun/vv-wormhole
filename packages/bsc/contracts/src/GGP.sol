// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {IERC4626} from "./IERC4626.sol";

contract GGP is ERC20, IERC4626, Ownable {
    using SafeERC20 for IERC20;

    IERC20 private _asset;
    uint256 public constant FIXED_CONVERSION_RATE = 100; // 1 StakeStone = 100 tokens

    constructor(IERC20 asset) Ownable(_msgSender())
        ERC20("Good Game Point", "GGP")
    {
        _asset = asset;
    }

    function deposit(uint256 assets, address receiver) external override returns (uint256 shares) {
        shares = assets * FIXED_CONVERSION_RATE;

        _asset.safeTransferFrom(msg.sender, address(this), assets);
        _mint(receiver, shares);

        return shares;
    }

    function withdraw(uint256 assets, address receiver, address owner) external override returns (uint256 shares) {
        assets = shares / FIXED_CONVERSION_RATE;

        if (msg.sender != owner) {
            uint256 currentAllowance = allowance(owner, msg.sender);
            require(currentAllowance >= shares, "ERC20: transfer amount exceeds allowance");
            _approve(owner, msg.sender, currentAllowance - shares);
        }

        _burn(owner, shares);
        _asset.safeTransfer(receiver, assets);

        return assets;
    }

    function totalAssets() public view override returns (uint256) {
        return _asset.balanceOf(address(this));
    }
}
