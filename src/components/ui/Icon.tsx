import { styled } from "nativewind";
import { MsIcon, type MsIconDefinition, type MsIconProps } from "material-symbols-react-native";
import * as RoundedIcons from "@material-symbols-react-native/rounded-400";

type RoundedIconKey = keyof typeof RoundedIcons;

type IconProps = Omit<MsIconProps, "icon"> & {
  name: string;
  fill?: boolean;
  className?: string;
};

const StyledMsIcon = styled(MsIcon, {
  className: {
    target: false,
    nativeStyleMapping: {
      color: "color",
      width: "size",
      height: "size",
    },
  },
} as never) as (props: MsIconProps & { className?: string }) => React.ReactElement;

function toMsIconKey(name: string, fill: boolean): RoundedIconKey {
  const pascal = name
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return `ms${pascal}${fill ? "Fill" : ""}` as RoundedIconKey;
}

export function Icon({ name, fill = false, className, size, color }: IconProps) {
  const iconKey = toMsIconKey(name, fill);
  const icon = RoundedIcons[iconKey] as MsIconDefinition | undefined;

  if (!icon) {
    if (__DEV__) {
      console.warn(`<Icon /> unknown icon "${name}" (resolved to "${iconKey}")`);
    }
    return null;
  }

  const mergedClassName = className
    ? `will-change-variable ${className}`
    : "will-change-variable";

  return <StyledMsIcon icon={icon} size={size} color={color} className={mergedClassName} />;
}

export default Icon;