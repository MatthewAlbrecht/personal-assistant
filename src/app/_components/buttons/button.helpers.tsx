import { PlusIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export function getButtonClassnames(size: ButtonSize, variant: ButtonVariant) {
  return clsx(
    "inline-flex items-center gap-x-2 rounded font-semibold shadow-sm",
    SIZE_STYLES[size],
    VARIANT_STYLES[variant],
  );
}

export type ButtonVariant = "primary" | "secondary" | "soft";
export type ButtonSize = "xs" | "sm" | "base" | "lg" | "xl";

const SIZE_STYLES = {
  xs: "px-2 py-1 text-xs",
  sm: "px-2 py-1 text-sm",
  base: "px-2.5 py-1.5 text-sm",
  lg: "px-3 py-2 text-sm",
  xl: "px-3.5 py-2.5 text-sm",
};

const VARIANT_STYLES = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  secondary:
    "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
  soft: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
};

export const Icons = {
  Plus: <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />,
  CheckCircle: (
    <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
  ),
} as const;

export type IconName = keyof typeof Icons;
