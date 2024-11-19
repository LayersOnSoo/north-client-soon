/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTimeRemaining } from "@/utils";
import {
  CalendarIcon,
  ExternalLinkIcon,
  CopyIcon,
} from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { DonationModal } from "./donation-modal";
import { SessionContext } from "../wallets/sessions";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import {
  cancelCampaign,
  cancelDonation,
  claimDonations,
} from "@/services/programs";
import { PublicKey } from "@solana/web3.js";
import { CampaignData } from "@/types";
import { delay } from "@/utils/delay";
import { useLocation } from "react-router-dom";
import { CopyText } from "../copy-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const APP_URL = import.meta.env.VITE_APP_URL as string;

export interface CampaignDetailProps {
  campaign: CampaignData;
  handleUpdateCampaign?: () => void;
}

export const CampaignDetail = ({
  campaign: {
    title,
    name,
    fundingReason,
    totalDonated,
    goal,
    studentImageUrl,
    projectLink,
    pdaAddress,
    startTimestamp,
    endTimestamp,
    donationCompleted,
    claimed,
    email,
    admissionProofUrl,
    universityName,
    matricNumber,
    courseOfStudy,
    yearOfEntry,
    studentResultImageUrl,
  },
  handleUpdateCampaign,
}: CampaignDetailProps) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");

  const totalDonatedPercent = Math.floor((totalDonated / goal) * 100);
  const {
    days: startDays,
    hours: startHours,
    minutes: startMinutes,
    seconds: startSeconds,
    end: started,
  } = getTimeRemaining(startTimestamp);
  const { days, hours, minutes, seconds, end } = getTimeRemaining(endTimestamp);
  const currentTime = new Date().getTime();

  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();

  async function updateCampaignData() {
    if (handleUpdateCampaign) {
      await delay(3000);
      handleUpdateCampaign();
    }
  }

  async function handleClaimDonations() {
    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await claimDonations(program, campaign);
        toast.success("donations claimed");
        updateCampaignData();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("connect your wallet");
    }
  }

  async function handleCancelDonation() {
    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await cancelDonation(program, campaign, publicKey);
        toast.success("donation cancelled");
        updateCampaignData();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("connect your wallet");
    }
  }

  async function handleCancelCampaign() {
    if (program && publicKey) {
      try {
        const campaign = new PublicKey(pdaAddress);
        await cancelCampaign(program, campaign);
        toast.success("campaign cancelled");
        updateCampaignData();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("connect your wallet");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-[25px] md:grid-cols-3">
      <div className="relative hidden overflow-hidden rounded-md md:block">
        <img
          src={studentImageUrl}
          alt="campaign image"
          className="transition-all delay-100 hover:scale-125"
        />
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-bold">{title}</p>

          <CopyText
            text={`${APP_URL}/campaigns/${pdaAddress}`}
            className="cursor-pointer"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <span className="md:hidden">
                      <CopyIcon height={30} width={30} />
                    </span>

                    <span className="hidden md:block">
                      <CopyIcon height={40} width={40} />
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{`Copy the project's public link to share`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CopyText>
        </div>

        <a
          href={projectLink}
          target="_blank"
          className="my-[20px] flex items-center gap-[5px] font-bold"
        >
          {name}
          <ExternalLinkIcon height={22} width={22} />
        </a>

        <div className="grid grid-cols-1 gap-[15px] border-y-[2px] border-primary py-[15px] md:grid-cols-2 md:gap-0 md:py-0">
          <div className="border-primary md:border-r-[2px] md:py-[20px] md:pr-[15px]">
            <span className="text-[14px] font-bold">About Funding</span>
            <p>{fundingReason}</p>
          </div>

          <div className="flex flex-col justify-between gap-[10px] md:py-[20px] md:pl-[15px]">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[5px] font-semibold">
                  <span className="text-[12px]">Total Donated</span>
                  <span className="text-[14px]">{totalDonated} SOL</span>
                </div>

                <div
                  className={`flex min-w-[70px] flex-row py-1 items-center justify-center gap-[5px] rounded-md ${
                    donationCompleted ? "bg-green-500" : "bg-blue-500"
                  } px-5 font-semibold`}
                >
                  <span className="text-[14px]">Goal {"->"}</span>
                  <span className="text-[14px]">{goal} SOL</span>
                </div>
              </div>

              <Progress value={totalDonatedPercent} />
            </div>

            <div className="flex items-center justify-between">
              {!end && (
                <div className="flex items-center gap-[5px] text-[12px] font-bold">
                  <span>
                    <CalendarIcon height={20} width={20} />
                  </span>

                  {started ? (
                    <p>Campaign Started</p>
                  ) : (
                    <p>
                      {"Campaign starts in "}
                      {startDays > 0 && (
                        <span>
                          {startDays} {startDays > 1 ? "days" : "day"}
                        </span>
                      )}
                      {startDays <= 0 && startHours > 0 && (
                        <span>{startHours} hours</span>
                      )}
                      {startDays <= 0 &&
                        startHours <= 0 &&
                        startMinutes > 0 && <span>{startMinutes} minutes</span>}
                      {startDays <= 0 &&
                        startHours <= 0 &&
                        startMinutes <= 0 &&
                        startSeconds >= 0 && (
                          <span>{startSeconds} seconds</span>
                        )}
                    </p>
                  )}
                </div>
              )}

              {started && (
                <div className="flex items-center gap-[5px] text-[12px] font-bold">
                  <span>
                    <CalendarIcon height={20} width={20} />
                  </span>

                  {end ? (
                    <p>Campaign End</p>
                  ) : (
                    <p>
                      {days > 0 && (
                        <span>
                          {days} {days > 1 ? "days" : "day"}
                        </span>
                      )}
                      {days <= 0 && hours > 0 && <span>{hours} hours</span>}
                      {days <= 0 && hours <= 0 && minutes > 0 && (
                        <span>{minutes} minutes</span>
                      )}
                      {days <= 0 &&
                        hours <= 0 &&
                        minutes <= 0 &&
                        seconds >= 0 && <span>{seconds} seconds</span>}
                      {" left"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isDashboard && (
          <div className="mt-[20px] flex items-center justify-between">
            <Button
              disabled={!donationCompleted || claimed}
              onClick={handleClaimDonations}
            >
              {claimed ? "Donation claimed" : "Withdraw donation"}
            </Button>

            <Button
              variant={"destructive"}
              onClick={handleCancelCampaign}
              disabled={startTimestamp < currentTime}
            >
              Cancel campaign
            </Button>
          </div>
        )}

        {!isDashboard && (
          <div className="mt-[20px] flex items-center justify-between">
            <DonationModal
              pdaAddress={pdaAddress}
              startTimestamp={startTimestamp}
              endTimestamp={endTimestamp}
              donationCompleted={donationCompleted}
              handleUpdateCampaign={updateCampaignData}
            />

            <Button
              variant={"outline"}
              disabled={!end || (end && donationCompleted)}
              onClick={handleCancelDonation}
            >
              Cancel donation
            </Button>
          </div>
        )}
      </div>

      <div className="md:col-span-1 pt-10">
        <div className="space-y-4">
          {[
            { label: "Email", value: email },
            { label: "Matriculation Number", value: matricNumber },
            { label: "University Name", value: universityName },
            { label: "Course Of Study", value: courseOfStudy },
            { label: "Year Of Entry", value: yearOfEntry },
          ].map(({ label, value }, index) => (
            <div
              key={index}
              className="border-b-2 border-primary py-4 md:flex md:justify-between"
            >
              <span className="text-sm font-bold ">{label}</span>
              <p className="mt-2 md:mt-0 ">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 gap-[15px] border-y-[2px] border-primary dark:border-gray-700 py-[15px] md:grid-cols-2 md:gap-[15px] md:py-[20px]">
        <div className="border-primary dark:border-gray-700 md:border-r-[2px] space-y-5 md:pr-[15px]">
          <span className="text-[14px] font-bold ">Admission Letter</span>
          <img
            src={admissionProofUrl}
            alt="admission proof image"
            className="w-full max-w-md object-contain transition-transform duration-300 "
          />
        </div>
        <div className="flex flex-col justify-between space-y-5 md:pl-[15px]">
          <span className="text-[14px] font-bold">Student Result</span>
          <img
            src={studentResultImageUrl}
            alt="student result image"
            className="w-full max-w-md object-contain transition-transform duration-300 "
          />
        </div>
      </div>
    </div>
  );
};
