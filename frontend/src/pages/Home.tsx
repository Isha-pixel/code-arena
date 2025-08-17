// // // // src/pages/Home.tsx
// // // import { Heading, Container } from '@chakra-ui/react';

// // // const Home = () => {
// // //   return (
// // //     <Container centerContent>
// // //       <Heading as="h2">Home Page</Heading>
// // //       <p>Welcome to CodeArena!</p>
// // //     </Container>
// // //   );
// // // };

// // // export default Home;


// // // import { Box, Heading, Text, Button, HStack } from '@chakra-ui/react';
// // // import { Link as RouterLink } from 'react-router-dom';

// // // export default function Home() {
// // //   return (
// // //     <Box p={10} color="white">
// // //       <Heading size="2xl" mb={3}>Code. Compete. Conquer.</Heading>
// // //       <Text mb={8} color="gray.300">Solve problems, join contests, track your progress.</Text>
// // //       <HStack spacing={4}>
// // //         <Button as={RouterLink} to="/problems" colorScheme="teal">Explore Problems</Button>
// // //         <Button as={RouterLink} to="/contests" variant="outline" colorScheme="teal">Upcoming Contests</Button>
// // //         <Button as={RouterLink} to="/dashboard" variant="ghost">Dashboard</Button>
// // //       </HStack>
// // //     </Box>
// // //   );
// // // }



// // // src/pages/Home.tsx
// // import { Box, Heading, Text, HStack, Button } from '@chakra-ui/react';
// // import { Link as RouterLink } from 'react-router-dom';
// // import { motion } from 'framer-motion';

// // const MotionHeading = motion(Heading);
// // const MotionBox = motion(Box);

// // export default function Home() {
// //   return (
// //     <Box maxW="1200px" mx="auto" px={6} py={12}>
// //       <MotionHeading
// //         size="2xl"
// //         initial={{ opacity: 0, y: 8 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: .35 }}
// //         style={{
// //           backgroundImage:
// //             'linear-gradient(90deg, #1dcfb2 0%, #8bd6ff 50%, #c8a6ff 100%)',
// //           WebkitBackgroundClip: 'text',
// //           backgroundClip: 'text',
// //           color: 'transparent',
// //         }}
// //       >
// //         Code. Compete. Conquer.
// //       </MotionHeading>

// //       <Text mt={3} color="fg.muted" maxW="720px">
// //         Solve problems, join contests, track your progress.
// //       </Text>

// //       <MotionBox
// //         initial={{ opacity: 0, y: 6 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ delay: .1, duration: .3 }}
// //       >
// //         <HStack mt={6} spacing={4}>
// //           <Button as={RouterLink} to="/problems" variant="solid">Explore Problems</Button>
// //           <Button as={RouterLink} to="/contests" variant="outline">Upcoming Contests</Button>
// //           <Button as={RouterLink} to="/dashboard" variant="outline">Dashboard</Button>
// //         </HStack>
// //       </MotionBox>
// //     </Box>
// //   );
// // }


// // src/pages/Home.tsx
// import { Link as RouterLink } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Heading,
//   Text,
//   Button,
//   HStack,
//   VStack,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import { motion } from 'framer-motion';

// const MotionBox = motion(Box);
// const MotionHeading = motion(Heading);
// const MotionButton = motion(Button);

// export default function Home() {
//   const subColor = useColorModeValue('gray.600', 'gray.400');

//   return (
//     <Box
//       position="relative"
//       minH="calc(100vh - 64px)" // fill the screen under the navbar
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       px={{ base: 4, md: 8 }}
//       overflow="hidden"
//     >
//       {/* Ambient glow blobs */}
//       <Box
//         position="absolute"
//         top="-10%"
//         left="-10%"
//         w="420px"
//         h="420px"
//         bgGradient="radial(teal.500 0%, transparent 60%)"
//         filter="blur(60px)"
//         opacity={0.25}
//         pointerEvents="none"
//       />
//       <Box
//         position="absolute"
//         bottom="-12%"
//         right="-8%"
//         w="420px"
//         h="420px"
//         bgGradient="radial(purple.500 0%, transparent 60%)"
//         filter="blur(70px)"
//         opacity={0.25}
//         pointerEvents="none"
//       />

//       <Container maxW="6xl">
//         <VStack
//           as={motion.div}
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45, ease: 'easeOut' }}
//           spacing={8}
//           textAlign="center"
//           align="center"
//         >
//           {/* App name */}
//           <MotionHeading
//             size="md"
//             letterSpacing="widest"
//             color={subColor}
//             textTransform="uppercase"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//           >
//             CODE ARENA
//           </MotionHeading>

//           {/* Big headline with gradient */}
//           <MotionHeading
//             as="h1"
//             fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
//             lineHeight="1.1"
//             bgGradient="linear(to-r, teal.300, cyan.300, purple.300)"
//             bgClip="text"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//           >
//             Code. Compete. Conquer.
//           </MotionHeading>

//           <Text fontSize={{ base: 'md', md: 'lg' }} color={subColor} maxW="3xl">
//             Solve problems, join contests, and track your progress — all in one place.
//           </Text>

//           <HStack spacing={4} pt={2} wrap="wrap" justify="center">
//             <MotionButton
//               as={RouterLink}
//               to="/problems"
//               size="lg"
//               colorScheme="teal"
//               whileHover={{ scale: 1.04, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Explore Problems
//             </MotionButton>

//             <MotionButton
//               as={RouterLink}
//               to="/contests"
//               size="lg"
//               variant="outline"
//               colorScheme="teal"
//               whileHover={{ scale: 1.04, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Upcoming Contests
//             </MotionButton>

//             <MotionButton
//               as={RouterLink}
//               to="/dashboard"
//               size="lg"
//               variant="outline"
//               colorScheme="cyan"
//               whileHover={{ scale: 1.04, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Dashboard
//             </MotionButton>
//           </HStack>
//         </VStack>
//       </Container>
//     </Box>
//   );
// }



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
