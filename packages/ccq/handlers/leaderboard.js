const {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const { PublicKey } = require("@solana/web3.js");
const {
  PerChainQueryRequest,
  QueryProxyMock,
  QueryRequest,
  QueryResponse,
  SolanaPdaQueryRequest,
  SolanaPdaQueryResponse,
  signaturesToEvmStruct,
} = require('@wormhole-foundation/wormhole-query-sdk');
const base58 = require('bs58');
  
  const query = async (chain) => {
    const SOLANA_RPC = "https://api.devnet.solana.com";
    const SUI_RPC = "https://fullnode.devnet.sui.io:443";
    const owner = new PublicKey("99mjQz6jfKpZw5dE3Bxq1RUV311u2EBG4mSKAH49CEep");
    const mint = new PublicKey("FudkRodUCGiK2xs5egx9YpSP4iyQsfr7SsEVSRAkj8qA");
    // explicitly implement `getAssociatedTokenAddressSync` from @solana/spl-token
    // https://github.com/solana-labs/solana-program-library/blob/d72289c79/token/js/src/state/mint.ts#L190
    const programId = ASSOCIATED_TOKEN_PROGRAM_ID;
    const seeds = [owner, TOKEN_PROGRAM_ID, mint];
    const [address, bump] = PublicKey.findProgramAddressSync(
      seeds.map((seed) => seed.toBuffer()),
      programId
    );
    console.log(
      "\nPDA input ",
      programId.toString(),
      seeds.map((seed) => seed.toString())
    );
    console.log("\nPDA output", address.toString(), bump);
  
    console.log(`\nMocking query using ${SOLANA_RPC}\n`);
    const mock = new QueryProxyMock({
      1: SOLANA_RPC,
    });
    const query = new QueryRequest(42, [
      new PerChainQueryRequest(
        1,
        new SolanaPdaQueryRequest("finalized", [
          {
            programAddress: programId.toBytes(),
            seeds: seeds.map((seed) => seed.toBytes()),
          },
        ])
      ),
    ]);
    const resp = await mock.mock(query);
    // console.log(resp);
  
    const queryResponse = QueryResponse.from(Buffer.from(resp.bytes, "hex"));
    const solResponse = queryResponse.responses[0]
      .response;
    // console.log(queryResponse.responses[0].response);
    console.log("Account:", base58.encode(solResponse.results[0].account));
    console.log("Owner:  ", base58.encode(solResponse.results[0].owner));
    console.log(
      "Data:   ",
      Buffer.from(solResponse.results[0].data).toString("hex")
    );
    console.log("\n", AccountLayout.decode(solResponse.results[0].data), "\n");
   
  };

const CCQ = async (chain) => {
  try {
      const res = await query(chain);
      return res;
  } catch (error) {
    console.log(error);
  }
};

module.exports = CCQ;