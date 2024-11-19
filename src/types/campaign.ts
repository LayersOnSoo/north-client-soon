export interface CampaignData {
  donationCompleted: boolean;
  claimed: boolean;

  email: string;
  title: string;
  name: string;

  admissionProofUrl: string; // image
  universityName: string;

  matricNumber: string;
  courseOfStudy: string;
  yearOfEntry: number;

  studentImageUrl: string; // image
  studentResultImageUrl: string; // image

  fundingReason: string;
  projectLink: string;

  goal: number;
  totalDonated: number;
  startTimestamp: number;
  endTimestamp: number;

  pdaAddress: string;
}

export interface ContributionData {
  pdaAddress: string;
  contributor: string;
  amount: number;
}
