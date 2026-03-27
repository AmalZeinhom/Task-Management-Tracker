import { Calendar1Icon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerProps = {
  selectedDate: Date | null;
  onDateChange(date: Date | null): void;
};

export default function CustomDatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  return (
    <div className="relative w-[25%] hover:cursor-pointer transition">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        minDate={new Date()}
        placeholderText="Select deadline"
        className="w-full h-11 border-2 border-gray-400 rounded-xl px-3 pr-10"
      />

      <Calendar1Icon
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
      />
    </div>
  );
}
