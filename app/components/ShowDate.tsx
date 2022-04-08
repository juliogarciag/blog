import { format } from "date-fns";

export default function ShowDate({ date }: { date: Date | number | string }) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return (
    <time
      dateTime={format(date, "yyyy-MM-dd")}
      className="text-sm text-gray-600"
    >
      {format(date, "MMMM d, yyyy")}
    </time>
  );
}
