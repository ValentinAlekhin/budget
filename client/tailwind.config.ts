import type { Config } from "tailwindcss";

export default {
  content: [],
  theme: {
    extend: {
      height: {
        // @ts-ignore
        screen: ["100vh /* fallback for Opera, IE and etc. */", "100dvh"],
        "screen-small": "100svh",
        "screen-large": "100lvh",
      },
    },
  },
} satisfies Config;