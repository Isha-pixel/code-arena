// import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// const config: ThemeConfig = {
//   initialColorMode: "dark",
//   useSystemColorMode: false,
// };

// const theme = extendTheme({
//   config,
//   styles: {
//     global: {
//       "html, body": { background: "#0d1016", color: "gray.100" },
//       "#root": { minHeight: "100vh", background: "#0d1016" },
//       a: { color: "teal.300" },
//     },
//   },
// });

// export default theme;


// // src/theme.ts
// import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// const config: ThemeConfig = {
//   initialColorMode: 'dark',
//   useSystemColorMode: false,
// };

// const theme = extendTheme({
//   config,
//   styles: {
//     global: {
//       'html, body, #root': { height: '100%' },
//       body: { background: '#0d1016', color: 'gray.200' },
//     },
//   },
//   components: {
//     Heading: {
//       baseStyle: { color: 'gray.100' },
//     },
//     Text: {
//       baseStyle: { color: 'gray.200' },
//     },
//     Link: {
//       baseStyle: { color: 'teal.200', _hover: { color: 'teal.300' } },
//     },
//     Button: {
//       baseStyle: { fontWeight: 600 },
//       variants: {
//         outline: {
//           borderColor: 'whiteAlpha.300',
//           color: 'gray.100',
//           _hover: { bg: 'whiteAlpha.200' },
//         },
//         ghost: {
//           color: 'gray.200',
//           _hover: { bg: 'whiteAlpha.200' },
//         },
//         solid: {
//           bg: 'teal.500',
//           color: 'white',
//           _hover: { bg: 'teal.400' },
//         },
//       },
//       defaultProps: { variant: 'outline' },
//     },
//     Tabs: {
//       baseStyle: {
//         tab: {
//           color: 'gray.300',
//           _selected: { color: 'gray.100' },
//         },
//       },
//     },
//     Table: {
//       baseStyle: {
//         th: { color: 'gray.300', borderColor: 'whiteAlpha.300' },
//         td: { color: 'gray.200', borderColor: 'whiteAlpha.200' },
//       },
//     },
//     Tag: {
//       baseStyle: {
//         container: { bg: 'whiteAlpha.200', color: 'gray.100' },
//       },
//     },
//   },
// });

// export default theme;




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
