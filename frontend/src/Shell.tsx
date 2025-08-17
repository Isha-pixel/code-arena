import { Outlet, NavLink, Link as RouterLink } from 'react-router-dom';
import { Box, HStack, Link as CLink } from '@chakra-ui/react';
import NavBar from './components/NavBar';

export default function Shell() {
  return (
    <Box minH="100vh" bg="#0d1016">
      {/* your own NavBar (Chakra components inside) */}
      <NavBar />

      {/* or a tiny inline nav if you prefer:
      <HStack px={6} py={4} spacing={6} borderBottom="1px" borderColor="whiteAlpha.200">
        <CLink as={RouterLink} to="/" fontWeight="bold">CodeArena</CLink>
        <CLink as={NavLink} to="/problems">Problems</CLink>
        <CLink as={NavLink} to="/contests">Contests</CLink>
        <CLink as={NavLink} to="/leaderboard">Leaderboard</CLink>
        <CLink as={NavLink} to="/dashboard" ml="auto">Dashboard</CLink>
      </HStack>
      */}

      <Box p={6}>
        <Outlet />
      </Box>
    </Box>
  );
}
