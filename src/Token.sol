// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Profile} from "./Profile.sol";
import "wormhole-solidity-sdk/WormholeRelayerSDK.sol";
import "wormhole-solidity-sdk/interfaces/IERC20.sol";

contract Token is ERC20, Ownable, TokenSender, TokenReceiver {
    uint256 constant GAS_LIMIT = 250_000;

    address public profile;
    address public world;

    constructor(
        address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole,
        address _initialOwner,
        address _profile,
        address _world
    ) ERC20("CUBE Token", "CUBE") TokenBase(_wormholeRelayer, _tokenBridge, _wormhole) Ownable(_initialOwner) {
        profile = _profile;
        world = _world;
    }

    modifier onlyWorld() {
        require(_msgSender() == world, "Only world can call this function");
        _;
    }

    function setWorld(address _world) public onlyOwner {
        world = _world;
    }

    function quoteCrossChainDeposit(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        // Cost of delivering token and payload to targetChain
        uint256 deliveryCost;
        (deliveryCost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );

        // Total cost: delivery cost + cost of publishing the 'sending token' wormhole message
        cost = deliveryCost + wormhole.messageFee();
    }

    function sendCrossChainDeposit(
        uint16 targetChain,
        address targetHelloToken,
        address recipient,
        uint256 amount,
        address token
    ) public payable {
        uint256 cost = quoteCrossChainDeposit(targetChain);
        require(
            msg.value == cost,
            "msg.value must be quoteCrossChainDeposit(targetChain)"
        );

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        bytes memory payload = abi.encode(recipient);
        sendTokenWithPayloadToEvm(
            targetChain,
            targetHelloToken, // address (on targetChain) to send token and payload to
            payload,
            0, // receiver value
            GAS_LIMIT,
            token, // address of IERC20 token contract
            amount
        );
    }

    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32, // sourceAddress
        uint16,
        bytes32 // deliveryHash
    ) internal override onlyWormholeRelayer {
        require(receivedTokens.length == 1, "Expected 1 token transfers");

        address recipient = abi.decode(payload, (address));

        IERC20(receivedTokens[0].tokenAddress).transfer(
            recipient,
            receivedTokens[0].amount
        );
    }

    function mint(address to, uint256 _amount) public onlyWorld {
        _mint(to, _amount);
    }

    function burn(address from, uint256 _amount) public onlyWorld {
        _burn(from, _amount);
    }
}