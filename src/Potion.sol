// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC1155, IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "wormhole-solidity-sdk/WormholeRelayerSDK.sol";

contract Potion is ERC1155, Ownable, TokenSender, TokenReceiver {
    uint256 public constant STAMINA_POTION = 0;
    uint256 public constant HP_POTION = 1;

    address public world;

     constructor(address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole,
        address _initialOwner,
        address _world,
        string memory _itemURI
    ) 
    ERC1155(_itemURI)
    TokenBase(_wormholeRelayer, _tokenBridge, _wormhole)
    Ownable(_initialOwner)
    {
        world = _world;
    }

    modifier onlyWorld() {
        require(_msgSender() == world, "Only world can call this function");
        _;
    }

    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32, // sourceAddress
        uint16,
        bytes32 // deliveryHash
    ) internal override onlyWormholeRelayer {
        require(receivedTokens.length == 1, "Expected 1 token transfers");

        (address recipient, uint256 tokenId) = abi.decode(payload, (address, uint256));

        IERC1155(receivedTokens[0].tokenAddress).safeTransferFrom(
            recipient,
            address(this),
            tokenId,
            receivedTokens[0].amount,
            ""
        );
    }

    function mint(address _to, uint256 _id, uint256 _amount) public onlyWorld {
        _mint(_to, _id, _amount, "");
    }

    function burn(address _to, uint256 _id, uint256 _amount) public onlyWorld {
        _burn(_to, _id, _amount);
    }
}
