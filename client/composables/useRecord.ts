import { twMerge } from "tailwind-merge";
import dayjs, { Dayjs } from "dayjs";

export function useRecord() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "cost":
        return "red";

      case "dist":
        return "cyan";

      case "inc":
        return "green";
    }
  };

  const getTypeBackgroundClasses = (type: string) => {
    const color = getTypeColor(type);

    return twMerge(`bg-${color}-400`);
  };

  const filterRecordsByRange = (list: any[], start: Dayjs, end: Dayjs) =>
    list.filter(({ timestamp }) => {
      const time = dayjs(timestamp);

      return time.isAfter(start) && time.isBefore(end);
    });

  return { getTypeColor, getTypeBackgroundClasses, filterRecordsByRange };
}