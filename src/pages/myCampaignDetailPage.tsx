import { Link, useParams } from "react-router-dom";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { truncateAddress } from "@/utils";
import { UserCampaign } from "@/components/campaigns/userCampaign";

export default function MyCampaignDetailsPage() {
  const { pdaAddress } = useParams<{ pdaAddress: string }>();

  if (!pdaAddress) {
    return <div>Loading campaign details...</div>;
  }

  return (
    <ContentLayout title={`Campaign: ${truncateAddress(pdaAddress)}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/campaigns">Campaigns</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{truncateAddress(pdaAddress)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <UserCampaign pda={pdaAddress} />
    </ContentLayout>
  );
}
