import { useState } from "react";

export default function EditableText({ value, onSave }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  return isEditing ? (
    <input
      autoFocus
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
      onBlur={() => {
        setIsEditing(false);

        if (tempValue !== value) {
          onSave(tempValue);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }

        if (e.key === "Escape") {
          setTempValue(value);
          setIsEditing(false);
        }
      }}
      className="border px-2 py-1 rounded w-full"
    />
  ) : (
    <h2 onClick={() => setIsEditing(true)} className="cursor-pointer">
      {value}
    </h2>
  );
}
