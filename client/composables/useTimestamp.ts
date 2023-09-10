import dayjs from "dayjs";

export function useTimestamp() {
  const now = dayjs();

  const startOfCurrentDay = now.hour(0).minute(0).second(0).millisecond(0);
  const startOfCurrentMonth = startOfCurrentDay.date(1);

  const endOfCurrentDay = startOfCurrentDay.add(1, "day");
  const endOfCurrentMonth = startOfCurrentMonth.add(1, "month");

  return {
    now,
    startOfCurrentDay,
    startOfCurrentMonth,
    endOfCurrentDay,
    endOfCurrentMonth,
  };
}
