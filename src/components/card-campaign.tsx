import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
export interface CardCampaignProps {
  imageLink: string;
  title: string;
  raised: number;
  goal: number;
  pdaAddress: string;
}

export const CardCampaign = ({
  imageLink,
  title,
  goal,
  raised,
  pdaAddress,
}: CardCampaignProps) => {
  const location = useLocation();
  const { pathname } = location;
  const raisedPercent = Math.floor((raised / goal) * 100);

  return (
    <Link
      to={`/${
        pathname.includes("/dashboard") ? "dashboard/" : ""
      }campaigns/${pdaAddress}`}
      className="flex flex-col gap-[15px] rounded-md border p-[10px] shadow dark:shadow-gray-800"
    >
      <div className="relative h-[200px] w-[full] overflow-hidden">
        <img
          src={imageLink}
          alt="campaign image"
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      <p className="font-semibold">{title}</p>

      <div className="flex flex-col gap-[10px]">
        <Progress value={raisedPercent} />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[5px] font-semibold">
            <span className="text-[12px]">Raised</span>
            <span className="text-[14px]">{raised} SOL</span>
          </div>

          <div className="flex flex-col gap-[5px] font-semibold">
            <span className="text-[12px]">Goal</span>
            <span className="text-[14px]">{goal} SOL</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
