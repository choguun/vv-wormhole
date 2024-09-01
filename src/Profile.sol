// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC721, IERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "wormhole-solidity-sdk/WormholeRelayerSDK.sol";

contract Profile is ERC721, ERC721Enumerable, Ownable, TokenSender, TokenReceiver {  
    mapping(uint256 => string) public profileHandle; // tokenId => handle
    mapping(string => uint256) public handleToTokenId; // handle => tokenId
    // uint256 public price = 0.000001 ether; // 0.000001 ETH

    constructor(
        address _wormholeRelayer,
        address _tokenBridge,
        address _wormhole,
        address _initialOwner
    )
        ERC721("Profile", "Profile")
        TokenBase(_wormholeRelayer, _tokenBridge, _wormhole)
        Ownable(_initialOwner) {}

    function receivePayloadAndTokens(
        bytes memory payload,
        TokenReceived[] memory receivedTokens,
        bytes32, // sourceAddress
        uint16,
        bytes32 // deliveryHash
    ) internal override onlyWormholeRelayer {
        require(receivedTokens.length == 1, "Expected 1 token transfers");

        (address recipient, uint256 tokenId) = abi.decode(payload, (address, uint256));

        IERC721(receivedTokens[0].tokenAddress).transferFrom(
            recipient,
            address(this),
            tokenId
        );
    }
    
    function registerHandle(string memory username) external payable {
        mint(_msgSender(), username);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    }

    function mint(address _to, string memory username) public payable {
        // require(msg.value >= price, "Insufficient amount");
        require(handleToTokenId[username] == 0, "Handle already exists");
        require(this.balanceOf(_msgSender()) == 0, "Only one profile handle per wallet");

        _safeMint(_to, totalSupply() + 1);
        handleToTokenId[username] = totalSupply();
        profileHandle[totalSupply()] = username;
    }

    function withdraw() public onlyOwner {
        payable(_msgSender()).transfer(address(this).balance);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
      return super.supportsInterface(interfaceId);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
      super._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
      return super._update(to, tokenId, auth);
    }
}