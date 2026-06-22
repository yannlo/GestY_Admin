import { PressableProps, View } from "react-native";
import ThemedText from "../ThemedText";
import { Button } from "../Button";
import Icon from "../Icon";
import { ErrorMessage } from "./ErrorMessage";

type InputProps = {
  label: string;
  onPress: PressableProps["onPress"]
  isFullFilled: boolean;
  buttonLabel: string;
  buttonIcon?: string;
  fullFilLabel?: string;
  emptyLabel?: string;
  error?: string;
  required?: boolean;
};

export default function ButtonInput({
  label, 
  isFullFilled,
  onPress,
  buttonLabel = "Ajouter",
  buttonIcon = "add",
  fullFilLabel = "Enregistrement éffectué.",
  emptyLabel = "Aucune enregistré.",
  error,
  required,
}: InputProps) {
  return (
    <View className="gap-0.5 h-fit">
      {label && (
        <ThemedText format="label" color="gray800" className="mx-3">
          {label}{required ? " *" : ""}
        </ThemedText>
      )}
      <View className="justify-start items-center flex-row gap-2 ">
        <Button
          variant="outline"
          title={isFullFilled ? "Supprimer" : buttonLabel}
          iconLeft={isFullFilled ? "delete" : buttonIcon}
          onPress={onPress} />
        <View className="flex-1 flex-row justify-between items-center">
          <ThemedText color={isFullFilled ? "gray900" : "gray500"} className="text-lg">
            {isFullFilled ? fullFilLabel : emptyLabel}
          </ThemedText>
          {isFullFilled && <Icon name="check-circle" className="text-gy-primary-400 size-8" />}
        </View>
      </View>
      <ErrorMessage error={error} />
    </View>
  );
}
