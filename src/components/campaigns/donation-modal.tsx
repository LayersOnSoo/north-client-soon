/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import { donate } from "@/services/programs";
import { useWallet } from "@solana/wallet-adapter-react";
import { SessionContext } from "../wallets/sessions";

interface DonationModalProps {
  pdaAddress: string;
  startTimestamp: number;
  endTimestamp: number;
  donationCompleted: boolean;
  handleUpdateCampaign: () => void;
}

export const DonationModal = ({
  pdaAddress,
  startTimestamp,
  endTimestamp,
  donationCompleted,
  handleUpdateCampaign,
}: DonationModalProps) => {
  const [amount, setAmount] = useState(""); // Keep as string
  const currentTime = new Date().getTime();
  const ref = React.useRef();

  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  async function handleSubmit() {
    if (program && publicKey) {
      if (!amount || Number(amount) <= 0) {
        // Validate the amount
        toast.error("amount must be greater than 0");
        return;
      }

      try {
        const campaign = new PublicKey(pdaAddress);
        await donate(program, campaign, publicKey, Number(amount)); // Convert to number here
        toast.success("donation successful");
        handleUpdateCampaign();
        (ref as any).current?.click();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("connect your wallet");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild ref={ref as any}>
        <Button
          disabled={
            startTimestamp > currentTime ||
            donationCompleted ||
            endTimestamp < currentTime
          }
        >
          Fund this project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <p className="text-[22px] font-bold">Enter the donation amount:</p>
        <div className="mt-[20px]">
          <div className="mb-[20px] flex flex-col gap-[5px]">
            <Input
              type="number"
              placeholder="Input SOL amount to be donated"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Keep as string
            />
            <span className="text-sm">Amount in SOL</span>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Pay Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
