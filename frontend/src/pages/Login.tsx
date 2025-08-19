// src/pages/Login.tsx
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
