import { Cluster } from "@solana/web3.js";

export enum NetworkName {
  Mainnet = "Mainnet",
  Devnet = "Devnet",
  Testnet = "Testnet",
}

export type NetworkDictionary<T = string> = {
  [K in keyof typeof NetworkName]: T;
};

export const SolanaNetworkDictionary: NetworkDictionary = {
  [NetworkName.Mainnet]: "mainnet-beta",
  [NetworkName.Devnet]: "https://rpc.devnet.soo.network/rpc",
  [NetworkName.Testnet]: "https://rpc.testnet.soo.network/rpc",
};

/**
 * Associates a solana network to its name.
 */
export const TestChainToMainnetName: Record<Cluster, NetworkName> = {
  "mainnet-beta": NetworkName.Mainnet,
  devnet: NetworkName.Devnet,
  testnet: NetworkName.Testnet,
};
