import { type Config } from "tailwindcss";
import { nextui } from '@nextui-org/react';


export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: ['class', '[data-mode="dark"]'],
  plugins: [require("@tailwindcss/typography"), nextui()],
} satisfies Config;
