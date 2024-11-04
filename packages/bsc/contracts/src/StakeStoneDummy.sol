// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract StakeStoneDummy is ERC20, Ownable {
    // External contracts
    address public minter;
    // External contracts

    constructor() ERC20("StakeStoneDummy", "StakeStoneDummy", 18) Ownable(_msgSender()) {}

    modifier onlyMinter() {
        require(msg.sender == minter, "not vault");
        _;
    }

    function mint(address _to, uint256 _amount) public onlyMinter {
        require(_to != address(0), "Cannot mint to zero address");
        require(_amount > 0, "Amount should be greater than zero");
        
        _mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) public onlyMinter {
        _burn(_from, _amount);
    }

    function setNewMinter(address _minter) external onlyOwner {
        minter = _minter;
    }
}