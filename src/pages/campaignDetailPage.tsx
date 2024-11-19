import { Link, useParams } from "react-router-dom";
import { CampaignDetails } from "@/components/admin-panel/campaign-detail";
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

const AllCampaignDetailPage = () => {
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
      <CampaignDetails pda={pdaAddress} />
    </ContentLayout>
  );
};

export default AllCampaignDetailPage;
