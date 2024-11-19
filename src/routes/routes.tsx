/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";

import MyCampaignsPage from "@/pages/myCampaignsPage";
const NewCampaignPage = lazy(() => import("../pages/newCampaignPage"));

const HomePage = lazy(() => import("../pages/homePage"));
import AllCampaignsPage from "../pages/allCampaignsPage";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import CampaignLayout from "@/components/campaigns/campaign-layout";
import MyCampaignDetailsPage from "@/pages/myCampaignDetailPage";
import AllCampaignDetailPage from "@/pages/campaignDetailPage";
// const DashboardPage = lazy(() => import("../pages/dashboardPage"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    layout: "home",
  },
  {
    path: "/dashboard",
    element: <AdminPanelLayout />,
    layout: "dashboard",
    children: [
      {
        path: "campaigns",
        element: <MyCampaignsPage />,
      },
      {
        path: "campaigns/new",
        element: <NewCampaignPage />,
      },
      {
        path: "campaigns/:pdaAddress",
        element: <MyCampaignDetailsPage />,
      },
    ],
  },
  {
    path: "/campaigns",
    element: <CampaignLayout />,
    layout: "dashboard",
    children: [
      {
        path: "",
        element: <AllCampaignsPage />,
      },
      {
        path: ":pdaAddress",
        element: <AllCampaignDetailPage />,
      },
    ],
  },
];
