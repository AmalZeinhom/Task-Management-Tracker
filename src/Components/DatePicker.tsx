import { Calendar1Icon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerProps = {
  selectedDate: Date | null;
  onDateChange(date: Date | null): void;
};

export default function CustomDatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  return (
    <div className="relative w-full hover:cursor-pointer transition">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        minDate={new Date()}
        placeholderText="Pick a Date"
        className="w-full h-11 border border-gray-400 rounded-xl px-3 pr-10 hover:cursor-pointer"
      />

      <Calendar1Icon
        size={20}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}
