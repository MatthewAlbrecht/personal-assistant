import clsx from "clsx";
import React from "react";

type Props = {
  name: string;
  value: string;
  id: string;
  placeholder: string;
  label: string;
  autoComplete?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?:
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url"
    | "number"
    | "date";
  required?: boolean;
  leadingText?: { text: string; variant: "inline-block" | "inline" };
};

export default function FormInputText({
  name,
  value,
  id,
  type = "text",
  placeholder,
  label,
  onChange,
  autoComplete = "no",
  required = false,
  leadingText,
}: Props) {
  const inputStyles = getInputStyles(leadingText);
  const leadingTextStyles = getLeadingTextStyles(leadingText);

  return (
    <>
      <label
        htmlFor="name"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
          {leadingText && (
            <span className={leadingTextStyles}>{leadingText.text}</span>
          )}
          <input
            type={type}
            name={name}
            id={id}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            className={inputStyles}
            placeholder={placeholder}
            required={required}
          />
        </div>
      </div>
    </>
  );
}

function getInputStyles(leadingText: Props["leadingText"]) {
  return clsx(
    "block flex-1 border-0 py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
    leadingText != null
      ? leadingText.variant === "inline-block"
        ? "w-full min-w-0 rounded-none rounded-r-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        : "bg-transparent pl-1  focus:ring-0"
      : "bg-transparent focus:ring-0",
  );
}

function getLeadingTextStyles(leadingText: Props["leadingText"]) {
  return leadingText
    ? clsx(
        "items-center text-gray-500 sm:text-sm",
        leadingText.variant === "inline-block"
          ? "inline-flex  rounded-l-md border border-r-0 border-gray-300 px-3"
          : "flex select-none pl-3",
      )
    : "";
}

/* TODO @matthewalbrecht: ADD ERROR STATES */
