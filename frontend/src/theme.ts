// src/theme.ts
import { extendTheme } from '@chakra-ui/react';
import type { ThemeConfig } from '@chakra-ui/react';


const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50:  '#e6fcf9',
      100: '#c2f6ee',
      200: '#99efe1',
      300: '#66e6d1',
      400: '#3ad9be',
      500: '#1dcfb2',    // primary accent
      600: '#12a595',
      700: '#0e7b73',
      800: '#0a5550',
      900: '#073c38',
    },
  },
  semanticTokens: {
    colors: {
      'bg.canvas':    { default: '#0d1016' },
      'bg.surface':   { default: '#111722' },
      'fg.default':   { default: 'gray.100' },
      'fg.muted':     { default: 'gray.400' },
      'border.muted': { default: 'whiteAlpha.200' },
    },
  },
  styles: {
    global: {
      'html, body, #root': { height: '100%' },
      body: {
        bg: 'bg.canvas',
        color: 'fg.default',
      },
      'h1, h2, h3, h4, h5, h6': {
        color: 'fg.default',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: { color: 'fg.default' },
    },
    Button: {
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'black',
          _hover: { bg: 'brand.400' },
          _active: { bg: 'brand.600', color: 'white' },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.300',
          _hover: { bg: 'whiteAlpha.100' },
        },
      },
    },
    Tag: {
      baseStyle: { container: { bg: 'whiteAlpha.200', color: 'white' } },
    },
  },
});

export default theme;
