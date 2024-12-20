import { getProgramId, IDL, Northfund } from "@/programs/northfunding";
import { NetworkName } from "@/types";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

export const SessionContext = React.createContext<{
  selectedNetwork: NetworkName;
  program: Program<Northfund> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedNetwork: any;
}>({
  selectedNetwork: NetworkName.Testnet,
  program: null,
  setSelectedNetwork: () => {},
});

export function useSession() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkName>(
    NetworkName.Testnet
  );
  const [program, setProgram] = useState<Program<Northfund> | null>(null);
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      const connection = new Connection(
        "https://rpc.testnet.soo.network/rpc",
        "confirmed"
      );
      const provider: anchor.Provider = new anchor.AnchorProvider(
        connection,
        wallet,
        {
          commitment: "confirmed",
        }
      );
      anchor.setProvider(provider);

      const programId = getProgramId(selectedNetwork);

      const program = new anchor.Program(IDL, programId, provider);
      setProgram(program);
    }
  }, [selectedNetwork, wallet]);

  return {
    selectedNetwork,
    program,
    setSelectedNetwork,
  };
}
