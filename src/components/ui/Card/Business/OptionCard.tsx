import ThemedText from "../../ThemedText";
import CardLayout from "../CardLayout";
import CardBaseLine from "../CardBaseLine";
import { OPTIONS } from "@/constants/Enum";
import Dot from "../../Dot/Dot";


type Props = {
  options: Business["options"];
};

const OptionCard = ({
  options,
}: Props) => {
  return (
    <CardLayout>


      {OPTIONS.map(({ value, label }) => {
        const optionState = options[value];
        return (
          <Row
            key={value}
            label={label}
            state={optionState?.state ?? false}
            border={value !== OPTIONS[0].value}
          />
        );
      })}


    </CardLayout>

  );
};

type RowProps = {
  state: boolean;
  label: string
  border: boolean
};

const Row = ({ label, state, border}: RowProps) => (
  <CardBaseLine label={label} borderEnabled={border} className="pr-6 pl-6">
    <ThemedText format="strong" className='text-lg'>{state ? "Activée" : "Désactivée"}</ThemedText>
    <Dot state={state ? "green" : "red"} />

  </CardBaseLine>

);

export default OptionCard;
