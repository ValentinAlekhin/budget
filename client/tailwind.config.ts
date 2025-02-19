import type { Config } from 'tailwindcss'
import tailwindScrollbar from 'tailwind-scrollbar'

export default {
  theme: {
    extend: {
      height: {
        // @ts-ignore
        'screen': ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        'screen-small': '100svh',
        'screen-large': '100lvh',
      },
      scale: {
        175: '1.75',
        200: '2',
      },
    },
  },
  plugins: [tailwindScrollbar],
} satisfies Config
