import { useCallback, useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SessionContext } from "@/components/wallets/sessions";
import { fetchCampaignList } from "@/programs/northfunding/getProgramAccounts";
import { CampaignData } from "@/types";
import { CardCampaign } from "../card-campaign";

export const AllCampaignList = () => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const { selectedNetwork } = useContext(SessionContext);

  const getCampaignList = useCallback(async () => {
    try {
      const newCampaigns = await fetchCampaignList(selectedNetwork);
      setCampaigns(newCampaigns);
    } catch (error) {
      setCampaigns([]);
      console.log(error);
    }
  }, [selectedNetwork]);

  useEffect(() => {
    getCampaignList();
  }, [getCampaignList]);

  return (
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
  );
};
