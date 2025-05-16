const plugin = require('tailwindcss/plugin');

/**
 * Custom component styles plugin for Tailwind CSS v4
 * This defines all component styles programmatically using the plugin API
 */
module.exports = plugin(function({ addComponents, theme }) {
  // Button components
  const buttons = {
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
        outline: '2px solid transparent',
        outlineOffset: '2px',
        boxShadow: `0 0 0 2px ${theme('colors.primary.400')}`,
      },
      '&:disabled': {
        pointerEvents: 'none',
        opacity: '0.5',
      },
      '.dark &:focus-visible': {
        boxShadow: `0 0 0 2px ${theme('colors.primary.800')}`,
      },
    },
    '.btn-primary': {
      backgroundColor: theme('colors.primary.600'),
      color: theme('colors.white'),
      '&:hover': {
        backgroundColor: theme('colors.primary.700'),
      },
      '.dark &': {
        backgroundColor: theme('colors.primary.700'),
      },
      '.dark &:hover': {
        backgroundColor: theme('colors.primary.600'),
      },
    },
    '.btn-secondary': {
      backgroundColor: theme('colors.secondary.600'),
      color: theme('colors.white'),
      '&:hover': {
        backgroundColor: theme('colors.secondary.700'),
      },
      '.dark &': {
        backgroundColor: theme('colors.secondary.700'),
      },
      '.dark &:hover': {
        backgroundColor: theme('colors.secondary.600'),
      },
    },
    '.btn-ghost': {
      backgroundColor: 'transparent',
      color: theme('colors.gray.900'),
      '&:hover': {
        backgroundColor: theme('colors.gray.100'),
      },
      '.dark &': {
        color: theme('colors.gray.50'),
      },
      '.dark &:hover': {
        backgroundColor: theme('colors.gray.800'),
      },
    },
    '.btn-outline': {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme('colors.gray.300'),
      backgroundColor: 'transparent',
      color: theme('colors.gray.900'),
      '&:hover': {
        backgroundColor: theme('colors.gray.50'),
      },
      '.dark &': {
        borderColor: theme('colors.gray.700'),
        color: theme('colors.gray.50'),
      },
      '.dark &:hover': {
        backgroundColor: theme('colors.gray.800'),
      },
    },
    '.btn-sm': {
      height: theme('spacing.8'),
      paddingLeft: theme('spacing.3'),
      paddingRight: theme('spacing.3'),
      fontSize: theme('fontSize.xs'),
    },
    '.btn-md': {
      height: theme('spacing.10'),
      padding: theme('spacing.4'),
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
  };

  // Input components
  const inputs = {
    '.input': {
      display: 'flex',
      height: theme('spacing.10'),
      width: '100%',
      borderRadius: theme('borderRadius.md'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme('colors.gray.300'),
      backgroundColor: theme('colors.white'),
      padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
      fontSize: theme('fontSize.sm'),
      '&::placeholder': {
        color: theme('colors.gray.500'),
      },
      '&:focus-visible': {
        outline: 'none',
        boxShadow: `0 0 0 2px ${theme('colors.primary.400')}`,
        outlineOffset: '2px',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
      '.dark &': {
        borderColor: theme('colors.gray.700'),
        backgroundColor: theme('colors.gray.950'),
      },
      '.dark &::placeholder': {
        color: theme('colors.gray.400'),
      },
      '.dark &:focus-visible': {
        boxShadow: `0 0 0 2px ${theme('colors.primary.800')}`,
      },
    },
    '.input-error': {
      borderColor: theme('colors.red.500'),
      '&:focus-visible': {
        boxShadow: `0 0 0 2px ${theme('colors.red.500')}`,
      },
      '.dark &': {
        borderColor: theme('colors.red.500'),
      },
      '.dark &:focus-visible': {
        boxShadow: `0 0 0 2px ${theme('colors.red.500')}`,
      },
    },
    '.input-success': {
      borderColor: theme('colors.green.500'),
      '&:focus-visible': {
        boxShadow: `0 0 0 2px ${theme('colors.green.500')}`,
      },
      '.dark &': {
        borderColor: theme('colors.green.500'),
      },
      '.dark &:focus-visible': {
        boxShadow: `0 0 0 2px ${theme('colors.green.500')}`,
      },
    },
  };

  // Card components
  const cards = {
    '.card': {
      borderRadius: theme('borderRadius.lg'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme('colors.gray.200'),
      backgroundColor: theme('colors.white'),
      boxShadow: theme('boxShadow.sm'),
      '.dark &': {
        borderColor: theme('colors.gray.800'),
        backgroundColor: theme('colors.gray.950'),
      },
    },
    '.card-header': {
      display: 'flex',
      flexDirection: 'column',
      gap: theme('spacing.1.5'),
      padding: theme('spacing.6'),
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
  };

  // Register all components
  addComponents(buttons);
  addComponents(inputs);
  addComponents(cards);
});
