import type { KnownWorldName } from "./types";


/* -------------------------------------------------------------------------- */
/*                                    LINKS                                   */
/* -------------------------------------------------------------------------- */
export const youtubeLink = "";
export const githubLink = "";
export const linkedInLink = "";
export const twitterLink = "";
export const mailLink = "";
export const buyMeACoffeeLink = "";
export const discordLink = "";

export const voxelizeWorldLocalStorageKey = "voxelverses-world-name";
const potentialWorldName =
  new URLSearchParams(window.location.search).get("world") ??
  localStorage.getItem(voxelizeWorldLocalStorageKey) ??
  "terrain";
export const knownWorlds: KnownWorldName[] = [
  "main",
  "flat",
  "flat2",
  "lab",
  "terrain",
];
export const editableWorlds: KnownWorldName[] = ["flat", "flat2", "terrain"];
export const currentWorldName = knownWorlds.includes(
  potentialWorldName as KnownWorldName
)
  ? (potentialWorldName as KnownWorldName)
  : knownWorlds[0];

/* -------------------------------------------------------------------------- */
/*                                   COLORS                                   */
/* -------------------------------------------------------------------------- */
export const grayReplacement = "#C7C8CC";

export const characterModels = [
  "",
  "./assets/models/male1_model.glb",
  "./assets/models/male2_model.glb",
  "./assets/models/male3_model.glb",
  "./assets/models/female1_model.glb",
  "./assets/models/female2_model.glb",
  "./assets/models/female3_model.glb",
];

export const FAUCET_URL = "https://www.bnbchain.org/en/testnet-faucet";
export const BRIDGE_URL = "https://faucet.solana.com/";
export const CHAIN_NAME = "Solana Devnet";

export const NATIVE_SYMBOL = "SOL";
