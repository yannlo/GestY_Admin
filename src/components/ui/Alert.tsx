import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import Icon from "./Icon";
import ThemedText from "./ThemedText";

const alert = tv({
  base: "w-max flex-row items-start gap-2 rounded-md px-2 py-2",
  variants: {
    variant: {
      warning: "bg-gy-alert-warning",
      info: "bg-gy-alert-info",
      success: "bg-gy-alert-success",
      danger: "bg-gy-alert-danger",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});


type Props = ViewProps &
  VariantProps<typeof alert> & {
    message: string;
    className?: string;
  };

export default function Alert({
  message,
  variant,
  
  className,
  ...props
}: Props) {

  let iconName = "warning";

  switch (variant) {
    case "info":
      iconName = "info";
      break;
    case "success":
      iconName = "check-circle";
      break;
    case "danger":
      iconName = "dangerous";
      break;
    case "warning":
    default:
      iconName = "warning";
      break;
  }
    
  return (
    <View className={alert({ variant, className })} {...props}>
      <Icon name={iconName} className="mt-1 size-6" />
      <View className="flex-1 gap-0.5">
        <ThemedText format="alert" color="gray700" className="mt-0.5">
          {message}
        </ThemedText>
      </View>
    </View>
  );
}
