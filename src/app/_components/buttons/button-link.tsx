import React from "react";
import Link from "next/link";
import { type IconName, Icons, getButtonClassnames } from "./button.helpers";

type Props = {
  text?: string;
  href: string;
  isExternal?: boolean;
  variant: "primary" | "secondary" | "soft";
  size: "xs" | "sm" | "base" | "lg" | "xl";
  leadingIcon?: IconName;
  trailingIcon?: IconName;
};

export default function ButtonLink({
  href,
  text,
  isExternal = false,
  size,
  variant,
  leadingIcon,
  trailingIcon,
}: Props) {
  const classnames = getButtonClassnames(size, variant);
  const LeadingIcon = leadingIcon ? Icons[leadingIcon] : null;
  const TrailingIcon = trailingIcon ? Icons[trailingIcon] : null;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={classnames}
    >
      {LeadingIcon && LeadingIcon}
      {text != null && text}
      {TrailingIcon && TrailingIcon}
    </Link>
  );
}
