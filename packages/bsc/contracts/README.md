forge script script/Deploy.s.sol --rpc-url https://data-seed-prebsc-2-s3.bnbchain.org:8545 --broadcast

### Vision
Sustain GameFi economic backed by StakeStone, LST, LRT 

### Description
Good Game Points is an in-game token(ERC4626 & ERC20) designed to sustain the GameFi economy within Voxelverses. Backed by StakeStone, LST, LRT, GGP aims to address the key challenges faced by traditional GameFi projects by creating a sustainable and long-term economic model.

### Problems of GameFi:
1. Unsustainable Game Economics: Many GameFi projects suffer from unstable and unsustainable economic models, leading to inflation or deflation of in-game assets.
2. Short-Term Life Cycle: Traditional GameFi projects often have a short-lived existence due to the lack of long-term value and utility for their tokens.
3. Lack of Real Utility for Tokens: Most GameFi tokens lack tangible utility, making them speculative assets rather than integral parts of the game ecosystem.

### How it works:
![How it works](/GGP_howitworks.png "How it works")

### DEMO
https://ggp.voxelverses.xyz

### Deployed Contracts:
1. ETHDummy: https://testnet.bscscan.com/address/0x13211c88C8270B4f3E57d1CC12b3a92Bc4d80A4b
2. StakeStoneDummy: https://testnet.bscscan.com/address/0x403ad143c44A9b8DbBB6254eD0988b9334615eee
3. StoneMinter: https://testnet.bscscan.com/address/0x2bcfAD10e867FEFAD315cEE33d259711734AdAC1
4. StoneVault: https://testnet.bscscan.com/address/0xFEFe410b86C2fCdD395607f9283140b8e7AF3AB0
5. GGP (Good Game Point): https://testnet.bscscan.com/address/0x7891F9220B9ED5cB8D923eEd55728cbA2610d538
6. FeesVault: https://testnet.bscscan.com/address/0x2FBc4B3AFea5906123C8B335e11AA9bAFb2785Aa
7. World: https://testnet.bscscan.com/address/0x3043af000fd93b360121E70FD72fAf406954cBd3
8. Item: https://testnet.bscscan.com/address/0xC9290e2467a3242Eb6568b1c2b828C6fC6706fB7
9. Minter: https://testnet.bscscan.com/address/0xB5a5Af2a4C3239b712f0dEc3AAF6aaEE6eaB10bb

### How to deploy contracts
forge script script/Deploy.s.sol:Deploy --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545 --etherscan-api-key <APIKEY> --verify --broadcast

