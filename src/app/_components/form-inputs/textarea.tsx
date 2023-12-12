import React from "react";

type Props = {
  name: string;
  value: string;
  id: string;
  placeholder?: string;
  label: string;
  autoComplete?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  rows?: number;
};

export default function Textarea({
  name,
  value,
  id,
  placeholder,
  label,
  onChange,
  autoComplete = "no",
  required = false,
  rows = 4,
}: Props) {
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          name={name}
          id={id}
          rows={rows}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </>
  );
}
