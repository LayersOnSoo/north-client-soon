import { NetworkName } from "@/types";
import { PublicKey } from "@solana/web3.js";

const MAINNET_PROGRAM_ID = import.meta.env.VITE_MAINNET_PROGRAM_ID as string;
const DEVNET_PROGRAM_ID = import.meta.env.VITE_DEVNET_PROGRAM_ID as string;

export const getProgramId = (network: NetworkName): PublicKey => {
  const programIdString =
    network === NetworkName.Mainnet ? MAINNET_PROGRAM_ID : DEVNET_PROGRAM_ID;

  if (!programIdString) {
    throw new Error(`Program ID for ${network} is not defined`);
  }

  try {
    return new PublicKey(programIdString);
  } catch (err) {
    console.log(err);
    throw new Error(`Invalid Program ID for ${network}: ${programIdString}`);
  }
};
