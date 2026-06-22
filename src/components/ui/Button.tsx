import type React from "react";
import { ActivityIndicator, Pressable, type PressableProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import ThemedText from "./ThemedText";
import Icon from "./Icon";
import { COLORS } from "@/constants/colors";

const button = tv({
  base: "rounded-md flex-row self-center items-center justify-center gap-2 active:opacity-80 px-4 py-2",
  variants: {
    variant: {
      primary: "bg-gy-primary-500 active:bg-gy-primary-300 hover:bg-gy-primary-300 disabled:hover:bg-gy-gray-600 disabled:active:bg-gy-gray-600 disabled:bg-gy-gray-600",
      outline: "bg-gy-white outline outline-2 outline-gy-primary-500 outline-offset-[-2px] active:bg-gy-primary-200 hover:bg-gy-primary-200 disabled:outline-gy-gray-600 disabled:bg-gy-gray-200 disabled:active:bg-gy-gray-200 disabled:hover:bg-gy-gray-200",
      ghost: "bg-transparent active:bg-gy-gray-200 hover:bg-gy-gray-200 disabled:bg-transparent disabled:opacity-50",
    },
    fullWidth: {
      true: "self-stretch",
      false: "self-center",
    },
  },
  defaultVariants: {
    variant: "primary",
    fullWidth: false,
  },
});

const buttonIcon=tv({
   base: "size-7",
  variants: {
    color: COLORS,
  }
})

type Props = PressableProps &
  VariantProps<typeof button> & {
    title: string;
    iconLeft?: string,
    iconRight?: string,
    isLoading?: boolean;
    className?: string;
  };

export function Button({
  title,
  variant,
  iconLeft,
  iconRight,
  isLoading = false,
  fullWidth,
  className,
  disabled,
  ...props
}: Props) {

  let color: React.ComponentProps<typeof ThemedText>["color"] = "white";

  switch (variant) {
    case "primary":
      color = "white";
      break;
    case "outline":
      color = disabled ? "gray600" : "primary500";
      break;
    case "ghost":
      color = disabled ? "gray600" : "gray900";
      break;

  }

  return (
    <Pressable
      className={button({ variant, fullWidth, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator className="size-7.5" color={color === "white" ? "#effbf1" : "#185d23"} />
      ) : (
        <>
          {iconLeft && <Icon name={iconLeft} className={buttonIcon({ color})} /> }
          <ThemedText format="button" color={color}>
            {title}
          </ThemedText>
          {iconRight && <Icon name={iconRight} className={buttonIcon({ color})} />}
        </>
      )}
    </Pressable>
  );
}


const iconButton = tv({
  base: "rounded-full border border-gy-gray-200 items-center justify-center gap-2 active:opacity-80 disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-gy-primary-500 active:bg-gy-primary-300 hover:bg-gy-primary-300",
      outline: "bg-gy-white outline outline-2 outline-gy-primary-500 outline-offset-[-2px] active:bg-gy-gray-200 hover:bg-gy-gray-200",
      ghost: "rounded-md active:bg-gy-gray-200 hover:bg-gy-gray-200 border-0",
    },
    size: {
      lg: "size-20",
      md: "size-16",
      sm: "size-12",
      xs: "size-10",
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const icon= tv({
  base: "",
  variants: {
    variant: {
      primary: "text-gy-white",
      outline: "text-gy-primary-500",
      ghost: "text-gy-gray-800",
    },
    size: {
      lg: "size-14",
      md: "size-10",
      sm: "size-8",
      xs: "size-8",
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type IconButtonProps = VariantProps<typeof iconButton> & {
  name: string;
  filled?: boolean
};

export function IconButton({
  name,
  variant,
  size,
  filled= false,
  ...props
}: IconButtonProps & PressableProps) {
  return (
    <Pressable
      className={iconButton({ variant, size })}
      {...props}
    >
      <Icon name={name} fill={filled} className={icon({ variant, size })} />
    </Pressable>
  );
}


