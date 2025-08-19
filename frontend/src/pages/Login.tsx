// // // // src/pages/Login.tsx
// // // import { Heading, Container } from '@chakra-ui/react';

// // // const Login = () => {
// // //   return (
// // //     <Container centerContent>
// // //       <Heading as="h2">Login Page</Heading>
// // //     </Container>
// // //   );
// // // };

// // // export default Login;

// // // import { useState } from 'react';
// // // import { Container, Heading, Input, Button, VStack, useToast } from '@chakra-ui/react';
// // // import { login } from '../services/apiClient';

// // // export default function Login() {
// // //   const [username, setU] = useState('');
// // //   const [password, setP] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const toast = useToast();

// // //   async function handleLogin() {
// // //     setLoading(true);
// // //     try {
// // //       await login(username, password);
// // //       toast({ status: 'success', title: 'Logged in' });
// // //     } catch (e: any) {
// // //       toast({ status: 'error', title: 'Login failed', description: e?.response?.data?.detail || String(e) });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   return (
// // //     <Container maxW="sm" py={10}>
// // //       <Heading mb={6}>Login</Heading>
// // //       <VStack align="stretch" spacing={3}>
// // //         <Input placeholder="Username" value={username} onChange={(e) => setU(e.target.value)} />
// // //         <Input placeholder="Password" type="password" value={password} onChange={(e) => setP(e.target.value)} />
// // //         <Button colorScheme="teal" onClick={handleLogin} isLoading={loading}>Login</Button>
// // //       </VStack>
// // //     </Container>
// // //   );
// // // }



// // import { useState } from 'react';
// // import { Box, Input, Button, Heading, VStack, useToast, Link } from '@chakra-ui/react';
// // import axios from 'axios';
// // import { Link as RouterLink, useNavigate } from 'react-router-dom';
// // import useAuth from '../hooks/useAuth';

// // export default function Login() {
// //   const [u, setU] = useState(''); const [p, setP] = useState('');
// //   const toast = useToast(); const nav = useNavigate();
// //   const { login } = useAuth();

// //   const submit = async () => {
// //     try {
// //       const r = await axios.post('http://127.0.0.1:8000/api/token/', { username: u, password: p });
// //       login(r.data.access, r.data.refresh);
// //       toast({ status: 'success', title: 'Welcome!' });
// //       nav('/dashboard');
// //     } catch (e: any) {
// //       toast({ status: 'error', title: 'Login failed', description: e?.response?.data?.detail || String(e) });
// //     }
// //   };

// //   return (
// //     <Box p={10} color="white" maxW="400px">
// //       <Heading size="lg" mb={6}>Login</Heading>
// //       <VStack spacing={3} align="stretch">
// //         <Input placeholder="Username" value={u} onChange={e=>setU(e.target.value)}/>
// //         <Input placeholder="Password" type="password" value={p} onChange={e=>setP(e.target.value)}/>
// //         <Button onClick={submit} colorScheme="teal">Login</Button>
// //         <Link as={RouterLink} to="/register" color="teal.200">Create an account</Link>
// //       </VStack>
// //     </Box>
// //   );
// // }




// // src/pages/Login.tsx
// import { useState } from 'react';
// import {
//   Box, Input, Button, Heading, VStack, useToast, Link,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
// import api from '../services/apiClient'; // your pre-configured axios instance (baseURL)

// // const API_BASE = 'http://127.0.0.1:8000/api'; // keep in sync with your backend
// const API_BASE = 'https://backend.codearena.icu/api'; // keep in sync with your backend

// export default function Login() {
//   const [u, setU] = useState('');
//   const [p, setP] = useState('');
//   const [loading, setLoading] = useState(false);

//   const toast = useToast();
//   const nav = useNavigate();
//   const { login } = useAuth(); // your existing hook that accepts (access, refresh)

//   const submit = async () => {
//     if (!u || !p) {
//       toast({ status: 'warning', title: 'Enter username and password' });
//       return;
//     }
//     setLoading(true);
//     try {
//       // 1) Get JWTs
//       const tokenRes = await axios.post(`${API_BASE}/token/`, {
//         username: u,
//         password: p,
//       });

//       const access = tokenRes.data?.access;
//       const refresh = tokenRes.data?.refresh;

//       // keep your existing flow
//       login(access, refresh);

//       // also persist in localStorage in case login() only keeps them in memory
//       localStorage.setItem('token', access);
//       if (refresh) localStorage.setItem('refresh', refresh);

//       // make sure our api client sends the token
//       api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

//       // 2) Fetch current user (must include is_staff)
//       // Prefer /me/summary/ which you already use on the Dashboard.
//       // Fallback to /users/me/ if your API uses that path.
//       let userObj: any = null;
//       try {
//         const me = await api.get('/me/summary/');
//         userObj = me.data?.user ?? null;
//       } catch {
//         try {
//           const me2 = await api.get('/users/me/');
//           userObj = me2.data ?? null;
//         } catch {
//           // ignore – if we fail, the app will still work, just without admin UI
//         }
//       }

//       if (userObj) {
//         // must contain is_staff (boolean) for admin UI to show up
//         localStorage.setItem('user', JSON.stringify(userObj));
//       }

//       toast({ status: 'success', title: `Welcome${userObj?.username ? ', ' + userObj.username : '!'}` });
//       nav('/dashboard');
//     } catch (e: any) {
//       toast({
//         status: 'error',
//         title: 'Login failed',
//         description: e?.response?.data?.detail || String(e),
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box p={10} color="white" maxW="400px">
//       <Heading size="lg" mb={6}>Login</Heading>
//       <VStack spacing={3} align="stretch">
//         <Input
//           placeholder="Username"
//           value={u}
//           onChange={(e) => setU(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && submit()}
//         />
//         <Input
//           placeholder="Password"
//           type="password"
//           value={p}
//           onChange={(e) => setP(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && submit()}
//         />
//         <Button onClick={submit} colorScheme="teal" isLoading={loading}>
//           Login
//         </Button>
//         <Link as={RouterLink} to="/register" color="teal.200">
//           Create an account
//         </Link>
//       </VStack>
//     </Box>
//   );
// }









import { useState } from 'react';
import { Box, Input, Button, Heading, VStack, useToast, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api, { login as doLogin } from '../services/apiClient';

export default function Login() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async () => {
    if (!u || !p) {
      toast({ status: 'warning', title: 'Enter username and password' });
      return;
    }
    setLoading(true);
    try {
      // get tokens
      const { access, refresh } = await doLogin(u, p);

      // keep your existing flow
      login(access, refresh);

      // ensure future calls use the new access token
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // optional: fetch user summary (to detect admin etc.)
      let userObj: any = null;
      try {
        const me = await api.get('/me/summary/');
        userObj = me.data?.user ?? null;
      } catch {
        // ignore if not available
      }
      if (userObj) localStorage.setItem('user', JSON.stringify(userObj));

      toast({ status: 'success', title: `Welcome${userObj?.username ? ', ' + userObj.username : '!'}` });
      nav('/dashboard');
    } catch (e: any) {
      toast({
        status: 'error',
        title: 'Login failed',
        description: e?.response?.data?.detail || String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={10} color="white" maxW="400px">
      <Heading size="lg" mb={6}>Login</Heading>
      <VStack spacing={3} align="stretch">
        <Input placeholder="Username" value={u} onChange={(e) => setU(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <Input placeholder="Password" type="password" value={p} onChange={(e) => setP(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <Button onClick={submit} colorScheme="teal" isLoading={loading}>Login</Button>
        <Link as={RouterLink} to="/register" color="teal.200">Create an account</Link>
      </VStack>
    </Box>
  );
}
