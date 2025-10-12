import React from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  field: ControllerRenderProps<any, any>;
  error?: FieldError;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, type = "text", field, error }) => {
  return (
    <>
      <input
        id={id}
        placeholder={label}
        type={type}
        {...field}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
      {error && <p className="text-red-400 text-xs mt-1 text-left">{error.message}</p>}
    </>
  );
};

export default FormInput;
