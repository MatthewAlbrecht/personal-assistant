import React from "react";

import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";

export type OptionType<T extends string | number = string> = {
  value: T;
  label: string;
};

type Props<TValue extends string | number = string> = {
  name: string;
  value: string;
  id: string;
  label: string;
  srLabel?: string;
  options: OptionType<TValue>[];
  onChange: (value: string) => void;
  size: "large" | "small";
};

export default function RadioSmallCards<
  TValue extends string | number = string,
>({ value, onChange, name, id, label, srLabel, options, size }: Props<TValue>) {
  return (
    <>
      <h2 className="text-sm font-medium leading-6 text-gray-900">{label}</h2>
      <RadioGroup
        value={value}
        onChange={onChange}
        className="mt-2"
        name={name}
        id={id}
      >
        <RadioGroup.Label className="sr-only">
          {srLabel ?? label}
        </RadioGroup.Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.label}
              value={String(option.value)}
              className={({ active, checked }) =>
                clsx(
                  active ? "ring-2 ring-indigo-600 ring-offset-2" : "",
                  checked
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                  "flex cursor-pointer items-center justify-center rounded-md px-3 py-3 text-sm font-semibold uppercase sm:flex-1",
                  size === "large" ? "px-3 py-3 text-sm" : "px-2 py-2 text-xs",
                )
              }
            >
              <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  );
}
