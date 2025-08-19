// src/pages/Home.tsx
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionButton = motion(Button);

function ShinyPill() {
  const labelColor = useColorModeValue('teal.600', 'teal.200');

  return (
    <MotionBox
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
      position="relative"
      px={{ base: 4, md: 6 }}
      py={{ base: 2, md: 2.5 }}
      borderRadius="full"
      fontWeight="semibold"
      letterSpacing="widest"
      textTransform="uppercase"
      fontSize={{ base: 'sm', md: 'md' }}
      color={labelColor}
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.300"
      backdropFilter="auto"
      backdropBlur="6px"
      overflow="hidden"
      whileHover={{ scale: 1.04 }}
      sx={{
        // shimmering line
        '@keyframes shine': {
          '0%': { left: '-150%' },
          '100%': { left: '150%' },
        },
      }}
    >
      {/* soft neon glow behind the pill */}
      <Box
        position="absolute"
        inset="-10px"
        borderRadius="inherit"
        bgGradient="linear(to-r, teal.400, cyan.400, purple.400)"
        opacity={0.25}
        filter="blur(22px)"
        zIndex={-1}
      />
      {/* thin rotating shimmer swipe */}
      <Box
        position="absolute"
        top={0}
        left="-150%"
        w="150%"
        h="100%"
        bgGradient="linear(to-r, transparent, whiteAlpha.500, transparent)"
        transform="skewX(-20deg)"
        animation="shine 3s linear infinite"
      />
      CODE ARENA
    </MotionBox>
  );
}

export default function Home() {
  const subColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      position="relative"
      minH="calc(100vh - 64px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 8 }}
      overflow="hidden"
    >
      {/* Ambient glow blobs */}
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="460px"
        h="460px"
        bgGradient="radial(teal.500 0%, transparent 60%)"
        filter="blur(70px)"
        opacity={0.25}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-12%"
        right="-8%"
        w="480px"
        h="480px"
        bgGradient="radial(purple.500 0%, transparent 60%)"
        filter="blur(80px)"
        opacity={0.25}
        pointerEvents="none"
      />

      <Container maxW="6xl">
        <VStack
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          spacing={8}
          textAlign="center"
          align="center"
        >
          <ShinyPill />

          <MotionHeading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
            lineHeight="1.1"
            bgGradient="linear(to-r, teal.300, cyan.300, purple.300)"
            bgClip="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Code. Compete. Conquer.
          </MotionHeading>

          <Text fontSize={{ base: 'md', md: 'lg' }} color={subColor} maxW="3xl">
            Solve problems, join contests, and track your progress — all in one place.
          </Text>

          <HStack spacing={4} pt={2} wrap="wrap" justify="center">
            <MotionButton
              as={RouterLink}
              to="/problems"
              size="lg"
              colorScheme="teal"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Problems
            </MotionButton>

            <MotionButton
              as={RouterLink}
              to="/contests"
              size="lg"
              variant="outline"
              colorScheme="teal"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Upcoming Contests
            </MotionButton>

            <MotionButton
              as={RouterLink}
              to="/dashboard"
              size="lg"
              variant="outline"
              colorScheme="cyan"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Dashboard
            </MotionButton>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
