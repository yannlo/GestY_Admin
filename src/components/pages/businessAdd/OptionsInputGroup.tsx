import InputGroup from "@/components/layouts/InputGroup";
import { ToggleInput } from "@/components/ui/Input";

export type OptionsInputGroupProps = {
  options: BusinessForm["options"];
  activities: BusinessForm["activities"];
  onToggleOption: (option: OptionState) => void;
};

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
      <ToggleInput
        label="Paiement différé"
        isToggled={isOptionToggled(options.deferredPayment)}
        isDisabled={true || isOptionDisabled(options.deferredPayment)} // volontairement désactivé
        onChange={() => onToggleOption(options.deferredPayment)} />
      <ToggleInput
        label="Edition de vente par un vendeur"
        isToggled={isOptionToggled(options.sellerSaleEditing)}
        isDisabled={isOptionDisabled(options.sellerSaleEditing)}
        onChange={() => onToggleOption(options.sellerSaleEditing)} />
      <ToggleInput
        label="Gestion des consignations"
        isToggled={isOptionToggled(options.consignmentManagement)}
        isDisabled={isOptionDisabled(options.consignmentManagement)}
        onChange={() => onToggleOption(options.consignmentManagement)} />
      <ToggleInput
        label="Gestion des ardoises"
        isToggled={isOptionToggled(options.slateManagement)}
        isDisabled={true || isOptionDisabled(options.slateManagement)}
        onChange={() => onToggleOption(options.slateManagement)} />
    </InputGroup>
  );
}
