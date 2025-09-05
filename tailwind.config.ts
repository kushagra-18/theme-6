import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.base-content / 70%'),
            '--tw-prose-headings': theme('colors.base-content'),
            '--tw-prose-lead': theme('colors.base-content'),
            '--tw-prose-links': theme('colors.primary'),
            '--tw-prose-bold': theme('colors.base-content'),
            '--tw-prose-counters': theme('colors.base-content'),
            '--tw-prose-bullets': theme('colors.base-content'),
            '--tw-prose-hr': theme('colors.base-content / 20%'),
            '--tw-prose-quotes': theme('colors.base-content'),
            '--tw-prose-quote-borders': theme('colors.primary'),
            '--tw-prose-captions': theme('colors.base-content / 50%'),
            '--tw-prose-code': theme('colors.base-content'),
            '--tw-prose-pre-code': theme('colors.base-content'),
            '--tw-prose-pre-bg': theme('colors.base-200'),
            '--tw-prose-th-borders': theme('colors.base-content / 20%'),
            '--tw-prose-td-borders': theme('colors.base-content / 10%'),
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'serif',
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: true, // all themes
  },
};
export default config;
