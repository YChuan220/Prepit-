/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './public/js/**/*.js'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '760px',
      lg: '1100px',
      xl: '1280px',
    },
    extend: {
      colors: {
        ground: 'rgb(var(--dp-rgb-ground) / <alpha-value>)',
        panel: 'rgb(var(--dp-rgb-panel) / <alpha-value>)',
        ink: 'rgb(var(--dp-rgb-ink) / <alpha-value>)',
        outline: 'rgb(var(--dp-rgb-outline) / <alpha-value>)',
        accent: 'rgb(var(--dp-rgb-accent) / <alpha-value>)',
        pink: 'rgb(var(--dp-rgb-accent-secondary) / <alpha-value>)',
        amber: 'rgb(var(--dp-rgb-accent-warm) / <alpha-value>)',
        mint: 'rgb(var(--dp-rgb-accent-fresh) / <alpha-value>)',
        field: 'rgb(var(--dp-rgb-field-soft) / <alpha-value>)',
        selection: 'rgb(var(--dp-rgb-selection) / <alpha-value>)',
        rule: 'rgb(var(--dp-rgb-rule-muted) / <alpha-value>)',
        slate: 'rgb(31 38 54 / <alpha-value>)',
      },
      fontFamily: {
        display: 'var(--dp-typography-display)',
        reading: 'var(--dp-typography-reading)',
      },
      fontSize: {
        meta: ['var(--dp-typography-metadata)', { lineHeight: '1.45' }],
        label: ['var(--dp-typography-label)', { lineHeight: '1.4' }],
        compact: ['var(--dp-typography-reading-compact)', { lineHeight: 'var(--dp-typography-reading-leading)' }],
      },
      borderRadius: {
        corner: 'var(--dp-radius-corner)',
        book: '34px',
      },
      borderWidth: {
        line: 'var(--dp-border-outline-width)',
        detail: 'var(--dp-border-detail-width)',
      },
      boxShadow: {
        hard: '5px 5px 0 0 var(--dp-color-outline)',
        'hard-sm': '3px 3px 0 0 var(--dp-color-outline)',
        'hard-lg': '8px 8px 0 0 var(--dp-color-outline)',
        'hard-accent': '5px 5px 0 0 var(--dp-color-accent)',
        'hard-pink': '6px 6px 0 0 var(--dp-color-accent-secondary)',
        'hard-amber': '6px 6px 0 0 var(--dp-color-accent-warm)',
        'hard-mint': '6px 6px 0 0 var(--dp-color-accent-fresh)',
      },
      transitionDuration: {
        interaction: 'var(--dp-motion-interaction)',
      },
      maxWidth: {
        page: '1240px',
      },
    },
  },
  plugins: [],
};
