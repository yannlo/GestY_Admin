import { View } from "react-native";
import ThemedText from "../../ThemedText";
import CardLayout from "../CardLayout";
import CardBaseLine from "../CardBaseLine";
import CardBodyLayout from "../CardBodyLayout";
import CardSubtitleLine from "../CardSubtitleLine";


type Props = {
  accountNumber: Business["accountNumber"];
  maxTotal?: number;
  maxOwner?: number;
  maxManager?: number;
  maxSeller?: number;
};

const AccountNumberCard = ({
  accountNumber,
  maxTotal = 10,
  maxOwner = 1,
  maxManager = 2,
  maxSeller = 7,
}: Props) => {
  return (
    <CardLayout>

      <CardBodyLayout>

        <CardSubtitleLine label="Comptes enregistrés">
          <ThemedText color='gray500' format="default" className="text-lg">({maxTotal} max)</ThemedText>
          <ThemedText format="strong" className='text-lg'>{accountNumber.total}</ThemedText>
        </CardSubtitleLine>

        <AccountRow label="Propriétaires" max={maxOwner} count={accountNumber.owner} />
        <AccountRow label="Vendeurs" max={maxSeller} count={accountNumber.seller} />
        <AccountRow label="Managers" max={maxManager} count={accountNumber.manager} />

      </CardBodyLayout>

    </CardLayout>

  );
};

type AccountRowProps = {
  label: string;
  max: number;
  count: number;
};

const AccountRow = ({ label, max, count }: AccountRowProps) => (
  <CardBaseLine label={label}>
    <ThemedText color='gray500' format="default" className="text-lg">({max} max)</ThemedText>
    <ThemedText format="strong" className='text-lg'>{count}</ThemedText>
  </CardBaseLine>

);

export default AccountNumberCard;
