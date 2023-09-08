import { twMerge } from "tailwind-merge";

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

  return { getTypeColor, getTypeBackgroundClasses };
}
