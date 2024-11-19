import React, { useContext, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CampaignDetail, Contributions } from "../campaigns";
import { CampaignData, ContributionData, IPFS_BASE_URL } from "@/types";
import { SessionContext } from "@/components/wallets/sessions";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface CampaignProps {
  pda: string;
}

export const CampaignDetails = ({ pda }: CampaignProps) => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  const getCampaign = useCallback(async () => {
    if (program && publicKey) {
      try {
        const campaignData = await program.account.campaign.fetch(pda);

        const newCampaign: CampaignData = {
          donationCompleted: campaignData.donationCompleted,
          claimed: campaignData.claimed,

          email: campaignData.email,
          title: campaignData.title,
          name: campaignData.name,

          admissionProofUrl: `${IPFS_BASE_URL}/${campaignData.admissionProofUrl}`,
          universityName: campaignData.universityName,

          matricNumber: campaignData.matricNumber,
          courseOfStudy: campaignData.courseOfStudy,
          yearOfEntry: campaignData.yearOfEntry,

          studentImageUrl: `${IPFS_BASE_URL}/${campaignData.studentImageUrl}`,
          studentResultImageUrl: `${IPFS_BASE_URL}/${campaignData.studentResultImageUrl}`,
          fundingReason: campaignData.fundingReason,
          projectLink: campaignData.projectLink,

          goal: campaignData.goal.toNumber() / LAMPORTS_PER_SOL,
          totalDonated: campaignData.totalDonated.toNumber() / LAMPORTS_PER_SOL,
          startTimestamp: campaignData.startAt.toNumber() * 1000,
          endTimestamp: campaignData.endAt.toNumber() * 1000,

          pdaAddress: pda,
        };
        setCampaign(newCampaign);
      } catch (error) {
        setCampaign(null);
        console.log(error);
      }
    }
  }, [program, publicKey, pda]); // Memoize with dependencies

  const getContributionList = useCallback(async () => {
    if (program && publicKey) {
      const allContributions = await program.account.contribution.all([
        { memcmp: { offset: 8, bytes: pda } },
      ]);

      const contributions: ContributionData[] = allContributions.map(
        ({ account: contributionAccount, publicKey: pdaPublicKey }) => ({
          amount: contributionAccount.amount.toNumber() / LAMPORTS_PER_SOL,
          pdaAddress: pdaPublicKey.toString(),
          contributor: contributionAccount.admin.toString(),
        })
      );
      setContributions(contributions);
    }
  }, [program, publicKey, pda]); // Memoize with dependencies

  useEffect(() => {
    getCampaign();
    getContributionList();
  }, [getCampaign, getContributionList]); // Now safe to include these

  return (
    <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
      <CardContent className="p-6">
        {campaign && (
          <CampaignDetail
            campaign={campaign}
            handleUpdateCampaign={getCampaign}
          />
        )}

        <Contributions className="mt-[36px]" contributions={contributions} />
      </CardContent>
    </Card>
  );
};
