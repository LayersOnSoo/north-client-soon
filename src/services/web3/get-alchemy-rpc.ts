import { NetworkName } from "@/types";

const ALCHEMY_SOLANA_MAINNET = import.meta.env
  .VITE_ALCHEMY_SOLANA_MAINNET as string;
const HELIUS_SOLANA_DEVNET = import.meta.env
  .VITE_HELIUS_SOLANA_DEVNET as string;

export async function getAlchemyRpcUrl(network: NetworkName): Promise<string> {
  const alchemySolanaMainnet = ALCHEMY_SOLANA_MAINNET;
  const alchemySolanaDevnet = HELIUS_SOLANA_DEVNET;

  return network === NetworkName.Mainnet
    ? alchemySolanaMainnet
    : alchemySolanaDevnet;
}
