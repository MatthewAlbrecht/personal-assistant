import React from "react";
import {
  getButtonClassnames,
  type ButtonSize,
  type ButtonVariant,
  type IconName,
  Icons,
} from "./button.helpers";

type Props = {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant: ButtonVariant;
  size: ButtonSize;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
};

export default function Button({
  onClick,
  text,
  variant,
  size,
  leadingIcon,
  trailingIcon,
}: Props) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    onClick?.(e);
  }

  const LeadingIcon = leadingIcon ? Icons[leadingIcon] : null;
  const TrailingIcon = trailingIcon ? Icons[trailingIcon] : null;
  const classNames = getButtonClassnames(size, variant);

  return (
    <button type="button" onClick={handleClick} className={classNames}>
      {LeadingIcon && LeadingIcon}
      {text != null && text}
      {TrailingIcon && TrailingIcon}
    </button>
  );
}
