import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../plugin/Source/UI/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        card_muted: 'rgb(var(--color-card-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        input: 'rgb(var(--color-input) / <alpha-value>)',
        ring: 'rgb(var(--color-ring) / <alpha-value>)',
        selection: 'rgb(var(--color-selection) / <alpha-value>)',
        text_primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
        text_secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        text_muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        shadow: 'rgb(var(--color-shadow) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        outer: '0px 4px 8px 0px rgba(0, 0, 0, 0.5), 0px 2px 4px 0px rgba(255, 255, 255, 0.1) inset',
        outer_md: '0px 6px 12px 0px rgba(0, 0, 0, 0.6), 0px 3px 6px 0px rgba(255, 255, 255, 0.1) inset',
        outer_lg: '0px 8px 16px 0px rgba(0, 0, 0, 0.7), 0px 4px 8px 0px rgba(255, 255, 255, 0.1) inset',
        outer_xl: '0px 12px 24px 0px rgba(0, 0, 0, 0.8), 0px 6px 12px 0px rgba(255, 255, 255, 0.1) inset',
        inner: '0px 2px 4px 0px rgba(0, 0, 0, 0.5) inset, 0px 1px 2px 0px rgba(255, 255, 255, 0.1)',
        inner_md: '0px 3px 6px 0px rgba(0, 0, 0, 0.6) inset, 0px 1.5px 3px 0px rgba(255, 255, 255, 0.1)',
        inner_lg: '0px 4px 8px 0px rgba(0, 0, 0, 0.7) inset, 0px 2px 4px 0px rgba(255, 255, 255, 0.1)',
        inner_xl: '0px 6px 12px 0px rgba(0, 0, 0, 0.8) inset, 0px 3px 6px 0px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui({
    prefix: 'ui',
    addCommonColors: false,
    defaultTheme: 'dark',
    defaultExtendTheme: 'dark',
    layout: {},
    themes: {
      dark: {
        layout: {},
        colors: {
          background: '#05071F',
          panel: '#0A0E29',
          card: '#141925',
          card_muted: '#1D2533',
          accent: '#1A2C42',
          muted: '#2A364D',
          destructive: '#3B0D11',
          border: '#1F293D',
          input: '#1A2C42',
          ring: '#2A364D',
          selection: '#2A364D',
          text_primary: '#F5F5F5',
          text_secondary: '#A0B0CA',
          text_muted: '#7585A3',
          brand: '#4C9CF5',
          shadow: '#000000',
        },
      },
    },
  })]
};
