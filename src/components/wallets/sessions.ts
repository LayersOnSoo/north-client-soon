import { NetworkName, SolanaNetworkDictionary } from "@/types";
import React, { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { IDL, getProgramId, Northfund } from "@/programs/northfunding";
import { clusterApiUrl } from "@solana/web3.js";

export const SessionContext = React.createContext<{
  selectedNetwork: NetworkName;
  program: Program<Northfund> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedNetwork: any;
}>({
  selectedNetwork: NetworkName.Devnet,
  program: null,
  setSelectedNetwork: () => {},
});

export function useSession() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkName>(
    NetworkName.Devnet
  );
  const [program, setProgram] = useState<Program<Northfund> | null>(null);
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      const connection = new anchor.web3.Connection(
        clusterApiUrl(SolanaNetworkDictionary[selectedNetwork]),
        { commitment: "confirmed" }
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
