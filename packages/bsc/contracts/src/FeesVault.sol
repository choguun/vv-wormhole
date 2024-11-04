// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {GGP} from "./GGP.sol";

contract FeesVault is Ownable {

    // External contracts
    address public ggp;
    // External contracts

    constructor(address _ggp) Ownable(_msgSender()) {
        ggp = _ggp;
    }

    function withdraw(address _to, uint256 _amount) external onlyOwner {
        require(_amount > 0, "amount must be greater than 0");
        require(_to != address(0), "to address must not be 0x0");

        GGP(ggp).transfer(_to, _amount);
    }
}