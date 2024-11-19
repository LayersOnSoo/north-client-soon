import { Program } from "@coral-xyz/anchor";
import { IDL, Northfund } from "./northfund-interface";
import { NetworkName } from "@/types";
import { Connection } from "@solana/web3.js";
import { getAlchemyRpcUrl } from "@/services/web3";
import { getProgramId } from "./programId";

export async function northfundProgramInstance(
  network: NetworkName
): Promise<Program<Northfund>> {
  const rpcUrl = await getAlchemyRpcUrl(network);
  const connection = new Connection(rpcUrl, "confirmed");
  const programId = getProgramId(network);
  const program = new Program<Northfund>(IDL, programId, {
    connection,
  });
  return program;
}
