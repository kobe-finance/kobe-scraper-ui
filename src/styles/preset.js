/**
 * Tailwind CSS v4 Preset for UI Components
 * 
 * This file defines component styles using the official Tailwind v4 preset system.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Define theme extensions specifically for components
  theme: {
    extend: {},
  },
  // Define component styles through plugins
  plugins: [
    // Component styles plugin
    function({ addComponents, theme }) {
      // Button components
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          fontSize: theme('fontSize.sm'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          transitionProperty: 'background-color, border-color, color',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.primary.700'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.secondary.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.secondary.700'),
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.900'),
          '&:hover': {
            backgroundColor: theme('colors.gray.100'),
          },
          '@media (prefers-color-scheme: dark)': {
            color: theme('colors.gray.100'),
            '&:hover': {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          borderWidth: '1px',
          borderColor: theme('colors.gray.300'),
          color: theme('colors.gray.900'),
          '&:hover': {
            backgroundColor: theme('colors.gray.50'),
          },
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.gray.700'),
            color: theme('colors.gray.100'),
            '&:hover': {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
        // Button sizes
        '.btn-sm': {
          height: theme('spacing.8'),
          fontSize: theme('fontSize.xs'),
          padding: `0 ${theme('spacing.3')}`,
        },
        '.btn-md': {
          height: theme('spacing.10'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
        },
        '.btn-lg': {
          height: theme('spacing.12'),
          fontSize: theme('fontSize.base'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
        },
      });

      // Card components
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          borderWidth: '1px',
          borderColor: theme('colors.gray.200'),
          boxShadow: theme('boxShadow.sm'),
          overflow: 'hidden',
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: theme('colors.gray.950'),
            borderColor: theme('colors.gray.800'),
          },
        },
        '.card-header': {
          padding: theme('spacing.6'),
          borderBottomWidth: '1px',
          borderColor: theme('colors.gray.200'),
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.gray.800'),
          },
        },
        '.card-content': {
          padding: theme('spacing.6'),
        },
        '.card-footer': {
          padding: theme('spacing.6'),
          borderTopWidth: '1px',
          borderColor: theme('colors.gray.200'),
          '@media (prefers-color-scheme: dark)': {
            borderColor: theme('colors.gray.800'),
          },
        },
      });

      // Input components
      addComponents({
        '.input': {
          display: 'flex',
          height: theme('spacing.10'),
          width: '100%',
          borderRadius: theme('borderRadius.md'),
          borderWidth: '1px',
          borderColor: theme('colors.gray.300'),
          backgroundColor: theme('colors.white'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.sm'),
          '&::placeholder': {
            color: theme('colors.gray.500'),
          },
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 1px ${theme('colors.primary.500')}`,
          },
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: theme('colors.gray.950'),
            borderColor: theme('colors.gray.700'),
            '&::placeholder': {
              color: theme('colors.gray.500'),
            },
            '&:focus': {
              borderColor: theme('colors.primary.600'),
              boxShadow: `0 0 0 1px ${theme('colors.primary.600')}`,
            },
          },
        },
      });
    },
  ],
};
