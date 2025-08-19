// src/components/Layout.tsx
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Box, Flex, HStack, Link, Container } from '@chakra-ui/react';

export default function Layout() {
  return (
    <Box>
      <Box borderBottom="1px" borderColor="gray.200" py={3}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Link as={RouterLink} to="/" fontWeight="bold">CodeArena</Link>
            <HStack spacing={6}>
              <Link as={RouterLink} to="/problems">Problems</Link>
              <Link as={RouterLink} to="/login">Login</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
}
