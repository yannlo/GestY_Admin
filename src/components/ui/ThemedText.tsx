import { COLORS } from "@/constants/colors";
import { Text, type TextProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const themedText = tv({
  variants: {
    format: {
      // Hero
      heroTitle: "text-3xl font-baloo-semibold leading-none",
      heroText: "font-baloo-medium text-xl leading-normal",

      // Tabs
      tab: "text-2xl font-baloo-medium leading-none",

      // Paragraphs
      default: "font-baloo-medium text-md leading-normal",
      light: "font-baloo text-md leading-normal",
      strong: "font-baloo-semibold text-md leading-normal",

      // Form elts
      label: "font-baloo-medium text-base leading-none",

      // Buttons
      button: "text-lg font-baloo-semibold leading-none",

      // Links
      link: "font-baloo-medium leading-none underline",

      // Alerts
      alert: "font-baloo-medium leading-normal",

      // Profile
      profile: "text-4xl font-baloo-semibold leading-none",
      profileLg: "text-6xl font-baloo-semibold leading-none",

      profileBusiness: "text-3xl font-baloo-semibold leading-none",
      profileName: "text-2xl font-baloo-semibold leading-none",
      profileRole: "text-lg font-baloo-medium leading-none",

      // Settings Menu
      settingsMenuTitle: "text-lg font-baloo-semibold leading-none",

      // Menu
      menu: "text-xl font-baloo-medium leading-none",

      //BottomSheet

      bottomSheetTitle: "text-2xl font-baloo-semibold leading-none",
      bottomSheetLabel: "text-xl font-baloo-semibold leading-none",
      bottomSheetLabelLite: "text-xl font-baloo-medium leading-none",

    },
    color: COLORS,
  },
  defaultVariants: {
    format: "default",
    color: "gray900",
  },
});

type Props = TextProps &
  VariantProps<typeof themedText> & {
    className?: string;
  };

export default function ThemedText({
  format,
  color,
  className,
  ...rest
}: Props) {

  return <Text className={themedText({ format, color, className })} {...rest} />;
}
