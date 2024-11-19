import {
  getProgramDerivedCampaign,
  getProgramDerivedContribution,
  Northfund,
} from "@/programs/northfunding";
import { getDateTimestamp } from "@/utils";
import { Program, BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function createCampaign(
  program: Program<Northfund>,
  signer: PublicKey,
  data: {
    email: string;
    title: string;
    name: string;

    admission_proof_url: string;
    university_name: string;

    matric_number: string;
    course_of_study: string;
    year_of_entry: number;

    student_image_url: string;
    student_result_image_url: string;

    funding_reason: string;
    project_link: string;

    goal: number;
    start_at: Date;
    end_at: Date;
  }
): Promise<string> {
  const goal = new BN(data.goal * LAMPORTS_PER_SOL);
  const startAt = new BN(getDateTimestamp(data.start_at));
  const endAt = new BN(getDateTimestamp(data.end_at));

  const { campaign } = await getProgramDerivedCampaign(
    program.programId,
    signer,
    data.matric_number
  );

  const tx = await program.methods
    .createCampaign(
      data.email,
      data.title,
      data.name,
      data.admission_proof_url,
      data.university_name,

      data.matric_number,
      data.course_of_study,
      data.year_of_entry,

      data.student_image_url,
      data.student_result_image_url,

      data.funding_reason,
      data.project_link,

      goal,
      startAt,
      endAt
    )
    .accounts({ campaign })
    .rpc();
  return tx;
}

export async function cancelCampaign(
  program: Program<Northfund>,
  campaign: PublicKey
): Promise<string> {
  const tx = await program.methods
    .cancelCampaign()
    .accounts({ campaign })
    .rpc();
  return tx;
}

export async function donate(
  program: Program<Northfund>,
  campaign: PublicKey,
  signer: PublicKey,
  amount: number
): Promise<string> {
  const newAmount = new BN(amount * LAMPORTS_PER_SOL);

  const { contribution } = await getProgramDerivedContribution(
    program.programId,
    signer,
    campaign
  );

  const tx = await program.methods
    .donate(newAmount)
    .accounts({ campaign, contribution })
    .rpc();
  return tx;
}

export async function cancelDonation(
  program: Program<Northfund>,
  campaign: PublicKey,
  signer: PublicKey
): Promise<string> {
  const { contribution } = await getProgramDerivedContribution(
    program.programId,
    signer,
    campaign
  );

  const tx = await program.methods
    .cancelDonation()
    .accounts({ campaign, contribution })
    .rpc();
  return tx;
}

export async function claimDonations(
  program: Program<Northfund>,
  campaign: PublicKey
): Promise<string> {
  const tx = await program.methods.claimDonation().accounts({ campaign }).rpc();
  return tx;
}
