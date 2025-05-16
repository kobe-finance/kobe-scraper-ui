/**
 * Tailwind CSS v4 Preset
 * 
 * Official preset pattern for component styling in Tailwind CSS v4
 * https://tailwindcss.com/docs/presets
 */

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom color palette can be defined here
        // These will be available through utility classes (e.g., bg-primary-500)
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    // Define component styles programmatically
    function({ addComponents, theme }) {
      // Button component styles
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.md'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          transitionProperty: 'color, background-color, border-color',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',
          '&:focus-visible': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme('colors.white')}, 0 0 0 4px ${theme('colors.primary.500')}`,
          },
          '&:disabled': {
            opacity: '0.5',
            pointerEvents: 'none',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.primary.700'),
          },
          '&:active': {
            backgroundColor: theme('colors.primary.800'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.secondary.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.secondary.700'),
          },
          '&:active': {
            backgroundColor: theme('colors.secondary.800'),
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.900'),
          '&:hover': {
            backgroundColor: theme('colors.gray.100'),
          },
          '&:active': {
            backgroundColor: theme('colors.gray.200'),
          },
          '@media (prefers-color-scheme: dark)': {
            color: theme('colors.gray.50'),
            '&:hover': {
              backgroundColor: theme('colors.gray.800'),
            },
            '&:active': {
              backgroundColor: theme('colors.gray.700'),
            },
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.900'),
          borderWidth: '1px',
          borderColor: theme('colors.gray.300'),
          '&:hover': {
            backgroundColor: theme('colors.gray.50'),
          },
          '&:active': {
            backgroundColor: theme('colors.gray.100'),
          },
          '@media (prefers-color-scheme: dark)': {
            color: theme('colors.gray.50'),
            borderColor: theme('colors.gray.700'),
            '&:hover': {
              backgroundColor: theme('colors.gray.800'),
            },
            '&:active': {
              backgroundColor: theme('colors.gray.700'),
            },
          },
        },
        // Button sizes
        '.btn-sm': {
          height: theme('spacing.8'),
          paddingLeft: theme('spacing.3'),
          paddingRight: theme('spacing.3'),
          fontSize: theme('fontSize.xs'),
        },
        '.btn-md': {
          height: theme('spacing.10'),
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
        },
        '.btn-lg': {
          height: theme('spacing.12'),
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          paddingTop: theme('spacing.3'),
          paddingBottom: theme('spacing.3'),
          fontSize: theme('fontSize.base'),
        },
      });

      // Input component styles
      addComponents({
        '.input': {
          display: 'flex',
          height: theme('spacing.10'),
          width: '100%',
          borderRadius: theme('borderRadius.md'),
          borderWidth: '1px',
          borderColor: theme('colors.gray.300'),
          backgroundColor: theme('colors.white'),
          paddingLeft: theme('spacing.3'),
          paddingRight: theme('spacing.3'),
          paddingTop: theme('spacing.2'),
          paddingBottom: theme('spacing.2'),
          fontSize: theme('fontSize.sm'),
          '&::placeholder': {
            color: theme('colors.gray.500'),
          },
          '&:focus-visible': {
            outline: 'none',
            borderColor: theme('colors.primary.400'),
            boxShadow: `0 0 0 2px ${theme('colors.primary.400')}`,
          },
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: '0.5',
          },
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.gray.700'),
            backgroundColor: theme('colors.gray.950'),
            '&::placeholder': {
              color: theme('colors.gray.400'),
            },
            '&:focus-visible': {
              borderColor: theme('colors.primary.800'),
              boxShadow: `0 0 0 2px ${theme('colors.primary.800')}`,
            },
          },
        },
        '.input-error': {
          borderColor: theme('colors.red.500'),
          '&:focus-visible': {
            boxShadow: `0 0 0 2px ${theme('colors.red.500')}`,
          },
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.red.500'),
            '&:focus-visible': {
              boxShadow: `0 0 0 2px ${theme('colors.red.500')}`,
            },
          },
        },
        '.input-success': {
          borderColor: theme('colors.green.500'),
          '&:focus-visible': {
            boxShadow: `0 0 0 2px ${theme('colors.green.500')}`,
          },
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.green.500'),
            '&:focus-visible': {
              boxShadow: `0 0 0 2px ${theme('colors.green.500')}`,
            },
          },
        },
      });

      // Card component styles
      addComponents({
        '.card': {
          borderRadius: theme('borderRadius.lg'),
          borderWidth: '1px',
          borderColor: theme('colors.gray.200'),
          backgroundColor: theme('colors.white'),
          boxShadow: theme('boxShadow.sm'),
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.gray.800'),
            backgroundColor: theme('colors.gray.950'),
          },
        },
        '.card-header': {
          display: 'flex',
          flexDirection: 'column',
          padding: theme('spacing.6'),
          paddingBottom: '0',
          marginBottom: theme('spacing.1.5'),
        },
        '.card-content': {
          padding: theme('spacing.6'),
          paddingTop: '0',
        },
        '.card-footer': {
          display: 'flex',
          alignItems: 'center',
          padding: theme('spacing.6'),
          paddingTop: '0',
        },
      });
    },
  ],
};
