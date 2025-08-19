// src/components/NavBar.tsx
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box, HStack, Link, Button, Spacer, Text, useColorModeValue, Icon,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import useAuth from '../hooks/useAuth';

export default function NavBar() {
  const { authed, isAdmin, logout, user } = useAuth();
  const loc = useLocation();

  const isActive = (to: string) =>
    to === '/'
      ? loc.pathname === '/'
      : loc.pathname === to || loc.pathname.startsWith(to + '/');

  const linkColor = 'whiteAlpha.900';
  const linkMuted = 'whiteAlpha.700';
  const activeBg  = 'whiteAlpha.200';

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      px={6}
      py={3}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      bg="#0d1016"
      backdropFilter="saturate(180%) blur(6px)"
    >
      <HStack spacing={4} align="center">
        {/* Brand */}
        <Link
          as={RouterLink}
          to="/"
          fontWeight="black"
          letterSpacing="0.5px"
          fontSize="lg"
          color={linkColor}
          _hover={{ textDecoration: 'none', color: 'teal.200' }}
        >
          <Text as="span" color="teal.300">CODE</Text> ARENA
        </Link>

        {/* Primary nav */}
        {[
          { to: '/problems', label: 'Problems' },
          { to: '/contests', label: 'Contests' },
          { to: '/leaderboard', label: 'Leaderboard' },
          ...(authed ? [{ to: '/submissions', label: 'Submissions' }, { to: '/profile', label: 'Profile' }] : []),
          ...(authed ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
        ].map(({ to, label }) => (
          <Link
            key={to}
            as={RouterLink}
            to={to}
            px={3}
            py={1.5}
            borderRadius="md"
            color={isActive(to) ? linkColor : linkMuted}
            bg={isActive(to) ? activeBg : 'transparent'}
            _hover={{ textDecoration: 'none', color: 'teal.200', bg: activeBg }}
          >
            {label}
          </Link>
        ))}

        {/* Admin quick action */}
        {isAdmin && (
          <Link
            as={RouterLink}
            to="/admin/problems/new"
            px={3}
            py={1.5}
            borderRadius="md"
            color="black"
            bg="teal.300"
            _hover={{ textDecoration: 'none', bg: 'teal.200' }}
            display="inline-flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={MdAdd} /> New Problem
          </Link>
        )}

        <Spacer />

        {/* Auth actions */}
        {!authed ? (
          <Link
            as={RouterLink}
            to="/login"
            color="white"
            _hover={{ color: 'teal.200', textDecoration: 'none' }}
          >
            Login
          </Link>
        ) : (
          <HStack spacing={3}>
            <Box color="whiteAlpha.600" fontSize="sm">
              {user?.username}
            </Box>
            <Button size="sm" onClick={logout} colorScheme="red" variant="solid">
              Logout
            </Button>
          </HStack>
        )}
      </HStack>
    </Box>
  );
}

