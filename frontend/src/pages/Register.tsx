//frontend/pages/Register.tsx
import { useState } from 'react';
import { Box, Input, Button, Heading, VStack, useToast } from '@chakra-ui/react';
import api from '../services/apiClient';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [u,setU]=useState(''); const [p,setP]=useState(''); const [e,setE]=useState('');
  const toast = useToast(); const nav = useNavigate(); const { login } = useAuth();

  const submit = async () => {
    try {
      const r = await api.post('/register/', { username: u, password: p, email: e });
      login(r.data.access, r.data.refresh);
      toast({ status: 'success', title: 'Account created' });
      nav('/dashboard');
    } catch (err:any) {
      toast({ status: 'error', title: 'Register failed', description: err?.response?.data?.detail || String(err) });
    }
  };

  return (
    <Box p={10} color="white" maxW="400px">
      <Heading size="lg" mb={6}>Register</Heading>
      <VStack spacing={3} align="stretch">
        <Input placeholder="Username" value={u} onChange={e=>setU(e.target.value)}/>
        <Input placeholder="Email (optional)" value={e} onChange={e=>setE(e.target.value)}/>
        <Input placeholder="Password" type="password" value={p} onChange={e=>setP(e.target.value)}/>
        <Button onClick={submit} colorScheme="teal">Create Account</Button>
      </VStack>
    </Box>
  );
}
