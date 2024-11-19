import { northfundProgramInstance } from "./northfund-instance";
import {
  CampaignData,
  ContributionData,
  IPFS_BASE_URL,
  NetworkName,
} from "@/types";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const fetchCampaignList = async (
  network: NetworkName
): Promise<CampaignData[]> => {
  const program = await northfundProgramInstance(network);
  const allCampaigns = await program.account.campaign.all();

  const campaigns: CampaignData[] = allCampaigns.map(
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
      totalDonated: campaignAccount.totalDonated.toNumber() / LAMPORTS_PER_SOL,
      startTimestamp: campaignAccount.startAt.toNumber() * 1000,
      endTimestamp: campaignAccount.endAt.toNumber() * 1000,

      pdaAddress: campaignPublicKey.toString(),
    })
  );
  return campaigns;
};

export const fetchCampaign = async (
  network: NetworkName,
  pda: string
): Promise<CampaignData> => {
  const program = await northfundProgramInstance(network);
  const campaignData = await program.account.campaign.fetch(pda);

  const campaign = {
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
  return campaign;
};

export const fetchContributionList = async (
  network: NetworkName,
  campaignPda: string
): Promise<ContributionData[]> => {
  const program = await northfundProgramInstance(network);

  const allContributions = await program.account.contribution.all([
    { memcmp: { offset: 8, bytes: campaignPda } },
  ]);

  const contributions: ContributionData[] = allContributions.map(
    ({ account: contributionAccount, publicKey: pdaPublicKey }) => ({
      amount: contributionAccount.amount.toNumber() / LAMPORTS_PER_SOL,
      pdaAddress: pdaPublicKey.toString(),
      contributor: contributionAccount.admin.toString(),
    })
  );
  return contributions;
};
