import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkName } from "@/types";
import { useContext } from "react";
import { SessionContext } from "../wallets/sessions";

export const SelectNetwork = () => {
  const { setSelectedNetwork } = useContext(SessionContext);

  return (
    <Select
      defaultValue={NetworkName.Devnet}
      onValueChange={(value) => setSelectedNetwork(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Network" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Network</SelectLabel>
          <SelectItem
            value={NetworkName.Mainnet}
            className="pointer-events-none opacity-30"
          >
            {NetworkName.Mainnet}
          </SelectItem>
          <SelectItem value={NetworkName.Devnet}>
            {NetworkName.Devnet}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
