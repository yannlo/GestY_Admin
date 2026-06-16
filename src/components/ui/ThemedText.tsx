import { Text, type TextProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const themedText = tv({
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
      alert: "font-baloo font-base leading-normal",
    },
    color: {
      white: "text-gy-white",
      black: "text-gy-black",

      primary100: "text-gy-primary-100",
      primary200: "text-gy-primary-200",
      primary300: "text-gy-primary-300",
      primary400: "text-gy-primary-400",
      primary500: "text-gy-primary-500",

      secondary100: "text-gy-secondary-100",
      secondary200: "text-gy-secondary-200",
      secondary300: "text-gy-secondary-300",
      secondary400: "text-gy-secondary-400",
      secondary500: "text-gy-secondary-500",

      gray50: "text-gy-gray-50",
      gray100: "text-gy-gray-100",
      gray200: "text-gy-gray-200",
      gray300: "text-gy-gray-300",
      gray400: "text-gy-gray-400",
      gray500: "text-gy-gray-500",
      gray600: "text-gy-gray-600",
      gray700: "text-gy-gray-700",
      gray800: "text-gy-gray-800",
      gray900: "text-gy-gray-900",

      productRed: "text-gy-product-red",
      productYellow: "text-gy-product-yellow",
      productBlack: "text-gy-product-black",
      productGreen: "text-gy-product-green",

      alertInfo: "text-gy-alert-info",
      alertSuccess: "text-gy-alert-success",
      alertWarning: "text-gy-alert-warning",
      alertDanger: "text-gy-alert-danger",
    },
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
  return <Text className={themedText({ format, color, className})} {...rest} />;
}
