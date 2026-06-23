import InputGroup from "@/components/layouts/InputGroup";
import { ToggleInput } from "@/components/ui/Input";
import { OPTIONS } from "@/constants/Enum";

export type OptionsInputGroupProps = {
  options: BusinessForm["options"];
  activities: BusinessForm["activities"];
  onToggleOption: (option: OptionState) => void;
};

const AVAILABLE_OPTIONS : Record<OptionValue, boolean> = {
  slateManagement: process.env.EXPO_PUBLIC_SLATE_MANAGEMENT_IS_AVAILABLE === "true",
  deferredPayment: process.env.EXPO_PUBLIC_DEFERRED_PAYMENT_IS_AVAILABLE === "true",
  sellerSaleEditing: process.env.EXPO_PUBLIC_SELLER_SALE_EDITING_IS_AVAILABLE === "true",
  consignmentManagement: process.env.EXPO_PUBLIC_CONSIGNMENT_MANAGEMENT_IS_AVAILABLE === "true",
}

export default function OptionsInputGroup({ options, activities, onToggleOption }: OptionsInputGroupProps) {
  const isOptionDisabled = (option: OptionState): boolean => {
    if (!option.activities || option.activities.length === 0) return false;
    return option.activities.every((activity) => activities[activity] === false);
  };

  const isOptionToggled = (option: OptionState): boolean => (
    option.state && !isOptionDisabled(option)
  );

  return (
    <InputGroup title="Listes des options">
      {OPTIONS.map(({ value, label }) => {
        const option = options[value];
        const isAvailable = AVAILABLE_OPTIONS[value];
        return (
          <ToggleInput
            key={value}
            label={label}
            isToggled={isOptionToggled(option)}
            isDisabled={!isAvailable || isOptionDisabled(option)}
            onChange={() => onToggleOption(option)} />
        );
      })}
    </InputGroup>
  );
}
