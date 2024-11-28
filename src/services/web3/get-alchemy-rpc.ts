import { NetworkName } from "@/types";

const ALCHEMY_SOLANA_MAINNET = import.meta.env
  .VITE_ALCHEMY_SOLANA_MAINNET as string;
const SOO_NETWORK_SOLANA_TESTNET = import.meta.env
  .VITE_SOO_NETWORK_SOLANA_TESTNET as string;

export async function getAlchemyRpcUrl(network: NetworkName): Promise<string> {
  const alchemySolanaMainnet = ALCHEMY_SOLANA_MAINNET;
  const sooNetworkSolanaTestnet = SOO_NETWORK_SOLANA_TESTNET;

  return network === NetworkName.Mainnet
    ? alchemySolanaMainnet
    : sooNetworkSolanaTestnet;
}
