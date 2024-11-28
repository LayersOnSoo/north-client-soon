import { NetworkName } from "@/types";
import { Program } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { IDL, Northfund } from "./northfund-interface";
import { getProgramId } from "./programId";

export async function northfundProgramInstance(
  network: NetworkName
): Promise<Program<Northfund>> {
  // const rpcUrl = await getAlchemyRpcUrl(network);
  const connection = new Connection(
    "https://rpc.testnet.soo.network/rpc", // soo.network RPC endpoint
    "confirmed" // Commitment level
  );
  const programId = getProgramId(network);
  const program = new Program<Northfund>(IDL, programId, {
    connection,
  });
  return program;
}
