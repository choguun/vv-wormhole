# vv-wormhole

### Battle of Multi Chain

#### Fully omni-chain MMORPG sandbox game, Player can stake LST token on EVM chain and mint in-game token in Solana and Sui chain that utlize speed and low cost of transactions.

#### Install Guide
pnpm i

#### Project Structure
1. packages/bsc
- contracts; solidity smart contracts on EVM chain
- web; web for lock LST token to mint game token this game token can trafer to Solana and Sui

2. packages/sol
- anchor; on-chain programs
- web; on-chain game web based
2.1 How to run sol project
- pnpm build:anchor
- pnpm build:websol

3. packages/sui
- move; Sui smart contracts
- web; on-chain game web based (not finished)
3.1 HOw to build sui project
- pnpm build:move

4. packages/ccq
- wormhole ccq to query leader from Solana and Sui
4.1 pnpm run:ccq

#### Key Features
1. NTT to supported multi-chain in-game token
2. CCQ to query multi-chain leader board
3. Collect point on each chain, Solana and Sui
4. Mine to collect points.