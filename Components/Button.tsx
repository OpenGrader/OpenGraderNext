import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { Url } from "url";

type ButtonProps = {
  variant?: "primary" | "secondary" | "rounded" | "filled" | "danger" | "text";
  className?: string;
  children: React.ReactNode;
  arrow?: "left" | "right";
  size?: "sm" | "md" | "lg";
  href?: string;
} & Record<string, any>;

type VariantRecord = {
  active: string;
  base: string;
};

const buttonStyles = new Map<ButtonProps["variant"], VariantRecord>([
  [
    "primary",
    {
      active: "hover:bg-gray-700 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-300 dark:hover:ring-cyan-300",
      base: "rounded-full bg-gray-900 text-white dark:bg-cyan-400/10 dark:text-cyan-400 dark:ring-1 dark:ring-inset dark:ring-cyan-400/20",
    },
  ],
  [
    "secondary",
    {
      active: "hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300",
      base: "rounded-full bg-gray-100 text-gray-900 dark:bg-gray-800/40 dark:text-gray-400 dark:ring-1 dark:ring-inset dark:ring-gray-800",
    },
  ],
  [
    "rounded",
    {
      active: "hover:bg-gray-900/2.5 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white",
      base: "rounded-full text-gray-700 ring-1 ring-inset ring-gray-900/10 dark:text-gray-400 dark:ring-white/10",
    },
  ],
  [
    "filled",
    {
      active: "hover:bg-gray-700 dark:hover:bg-cyan-500",
      base: "rounded-full bg-gray-900 text-white dark:bg-cyan-600 dark:text-white",
    },
  ],
  [
    "danger",
    {
      active: "hover:bg-gray-700 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:hover:ring-red-400",
      base: "rounded-full bg-gray-900 text-white dark:bg-red-400/10 dark:text-red-500 dark:ring-1 dark:ring-inset dark:ring-red-500/20",
    },
  ],
  ["text", { active: "hover:text-cyan-600 dark:hover:text-cyan-700", base: "text-cyan-500 dark:text-cyan-600 " }],
]);

const classNames = (...classes: any[]) => classes.filter(Boolean).join(" ");

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className,
  arrow,
  href,
  size = "md",
  ...props
}) => {
  const Component = href ? Link : "button";

  const arrowIcon = (
    <HiArrowRight
      className={classNames(
        "h-4 w-4",
        variant === "text" && "relative top-px",
        arrow === "left" && "mr-1 rotate-180",
        arrow === "right" && "ml-1",
      )}
    />
  );

  return (
    <>
      <Component
        {...props}
        href={href ?? ""}
        className={classNames(
          "whitespace-nowrap inline-flex gap-0.5 justify-center items-center overflow-hidden font-medium transition",
          buttonStyles.get(variant)!.base,
          props.disabled ? "hover:cursor-not-allowed" : buttonStyles.get(variant)!.active,
          size === "sm" && "text-xs py-0.5 px-2",
          size === "md" && "text-sm py-1 px-3",
          size === "lg" && "text-base py-1.5 px-4 font-medium",
          className,
        )}
      >
        {arrow === "left" && arrowIcon}
        {children}
        {arrow === "right" && arrowIcon}
      </Component>
    </>
  );
};

export default Button;
