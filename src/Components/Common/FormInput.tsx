import React from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";

interface FormInputProps {
  label?: string;
  id: string;
  type?: string;
  field: ControllerRenderProps<any, string>;
  error?: FieldError;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = "text",
  field,
  error,
  icon,
}) => {
  return (
    <div>
      <div className="relative w-full">
        <input
          id={id}
          placeholder={label}
          type={type}
          {...field}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
        />

        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/3 text-gray-400 cursor-pointer">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1 text-left">{error.message}</p>
      )}
    </div>
  );
};

export default FormInput;
