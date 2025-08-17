// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { ChakraProvider, extendTheme } from '@chakra-ui/react'
// import App from './App.jsx'
// import './index.css'
// import './styles/oj.css';


// const theme = extendTheme({}) // optional; keeps defaults

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <App />
//     </ChakraProvider>
//   </React.StrictMode>
// )



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import './index.css'
// import './styles/oj.css';

// const theme = extendTheme({
//   config: { initialColorMode: 'dark', useSystemColorMode: true },
// });

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <ColorModeScript initialColorMode={theme.config.initialColorMode} />
//       {/* Router MUST wrap anything that renders <Routes> */}
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </ChakraProvider>
//   </React.StrictMode>
// );


// // src/main.tsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { ChakraProvider } from '@chakra-ui/react';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';
// import theme from './theme';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ChakraProvider theme={theme}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </ChakraProvider>
//   </React.StrictMode>
// );



// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
