import { Card, CardContent } from "@/components/ui/card";
import { SessionContext } from "@/components/wallets/sessions";
import { CampaignData, IPFS_BASE_URL } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useContext, useEffect, useState } from "react";
import { CardCampaign } from "../card-campaign";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  const getCampaignList = useCallback(async () => {
    if (program && publicKey) {
      try {
        const allCampaigns = await program.account.campaign.all([
          { memcmp: { offset: 8, bytes: publicKey.toBase58() } },
        ]);

        const newCampaigns: CampaignData[] = allCampaigns.map(
          ({ account: campaignAccount, publicKey: campaignPublicKey }) => ({
            donationCompleted: campaignAccount.donationCompleted,
            claimed: campaignAccount.claimed,

            email: campaignAccount.email,
            title: campaignAccount.title,
            name: campaignAccount.name,

            admissionProofUrl: `${IPFS_BASE_URL}/${campaignAccount.admissionProofUrl}`,
            universityName: campaignAccount.universityName,

            matricNumber: campaignAccount.matricNumber,
            courseOfStudy: campaignAccount.courseOfStudy,
            yearOfEntry: campaignAccount.yearOfEntry,

            studentImageUrl: `${IPFS_BASE_URL}/${campaignAccount.studentImageUrl}`,
            studentResultImageUrl: `${IPFS_BASE_URL}/${campaignAccount.studentResultImageUrl}`,
            fundingReason: campaignAccount.fundingReason,
            projectLink: campaignAccount.projectLink,

            goal: campaignAccount.goal.toNumber() / LAMPORTS_PER_SOL,
            totalDonated:
              campaignAccount.totalDonated.toNumber() / LAMPORTS_PER_SOL,
            startTimestamp: campaignAccount.startAt.toNumber() * 1000,
            endTimestamp: campaignAccount.endAt.toNumber() * 1000,

            pdaAddress: campaignPublicKey.toString(),
          })
        );

        setCampaigns(newCampaigns);
      } catch (error) {
        setCampaigns([]);
        console.log(error);
      }
    }
  }, [program, publicKey]);

  useEffect(() => {
    getCampaignList();
  }, [getCampaignList]);

  return (
    <div>
      <Card className="mt-6 min-h-[calc(100vh_-_220px)] rounded-lg border-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <CardCampaign
                key={index}
                imageLink={campaign.studentImageUrl}
                title={campaign.title}
                raised={campaign.totalDonated}
                goal={campaign.goal}
                pdaAddress={campaign.pdaAddress}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignList;
