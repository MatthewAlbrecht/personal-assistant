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
}: Props) {
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
          <input
            type={type}
            name={name}
            id={id}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder={placeholder}
            required={required}
          />
        </div>
      </div>
    </>
  );
}

/* TODO @matthewalbrecht: ADD ERROR STATES */
