import { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  hint,
  rightSlot,
  ...rest
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  rightSlot?: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-[#2A2E2B]"
          {...rest}
        >
          {label}
        </label>
        {rightSlot}
      </div>
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-[#DEDACE] bg-white px-4 py-3 text-[15px] text-[#14181B] outline-none transition placeholder:text-[#A6A196] focus:border-[#C08A3E] focus:ring-4 focus:ring-[#C08A3E]/15 " +
        (props.className ?? "")
      }
    />
  );
}

export function PrimaryButton({
  loading,
  loadingText,
  children,
  ...rest
}: {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className="w-full rounded-lg bg-[#0E1B1B] px-4 py-3 text-[15px] font-medium text-[#FBFAF7] transition hover:bg-[#16302E] focus:outline-none focus:ring-4 focus:ring-[#0E1B1B]/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? loadingText ?? "Please wait…" : children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-5 rounded-lg border border-[#E3B9A6] bg-[#FBEEE8] px-4 py-3 text-sm text-[#9B4A2D]"
    >
      {message}
    </div>
  );
}