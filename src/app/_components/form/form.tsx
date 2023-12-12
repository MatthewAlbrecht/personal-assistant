import React from "react";

type FormProps = {
  children: React.ReactNode;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
} & React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

export default function Form({
  children,
  handleSubmit,
  ...HTMLFormProps
}: FormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2"
      {...HTMLFormProps}
    >
      {children}
    </form>
  );
}

export function FormBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
}

type FormButtonProps = {
  isLoading: boolean;
  cancelText?: string;
  submitText?: string;
  loadingText?: string;
};

export function FormButton({
  isLoading,
  cancelText = "Cancel",
  submitText = "Save",
  loadingText = "Submitting...",
}: FormButtonProps) {
  return (
    <div className="mt-6 flex items-center justify-end gap-x-6">
      <button
        type="button"
        className="text-sm font-semibold leading-6 text-gray-900"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isLoading ? loadingText : submitText}
      </button>
    </div>
  );
}

type FormInputContainerProps = {
  children: React.ReactNode;
  width: "full" | "4col";
};

export function FormInputContainer({
  children,
  width,
}: FormInputContainerProps) {
  const classes = width === "full" ? "col-span-full" : "sm:col-span-4";
  return <div className={classes}>{children}</div>;
}
