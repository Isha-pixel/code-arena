// // // src/pages/Problems.tsx
// // import { Heading, Container } from '@chakra-ui/react';

// // const Problems = () => {
// //   return (
// //     <Container centerContent>
// //       <Heading as="h2">Problems Page</Heading>
// //     </Container>
// //   );
// // };

// // export default Problems;


// // // src/pages/Problems.tsx
// // import { useEffect, useState } from 'react';
// // import {
// //   Heading,
// //   Container,
// //   Table,
// //   Thead,
// //   Tbody,
// //   Tr,
// //   Th,
// //   Td,
// //   Spinner,
// //   Alert,
// //   AlertIcon,
// //   VStack,
// //   Text,
// //   Badge,
// // } from '@chakra-ui/react';
// // import axios from 'axios';

// // // Define a type for our problem data for TypeScript
// // interface Problem {
// //   id: number;
// //   title: string;
// //   difficulty: 'Easy' | 'Medium' | 'Hard';
// //   tags: string[];
// // }

// // const Problems = () => {
// //   // State to store the list of problems
// //   const [problems, setProblems] = useState<Problem[]>([]);
// //   // State to handle loading status
// //   const [loading, setLoading] = useState<boolean>(true);
// //   // State to handle any errors during fetching
// //   const [error, setError] = useState<string | null>(null);

// //   // useEffect hook to fetch data when the component loads
// //   useEffect(() => {
// //     // Define the async function to fetch data
// //     const fetchProblems = async () => {
// //       try {
// //         const response = await axios.get('http://127.0.0.1:8000/api/problems/');
// //         setProblems(response.data);
// //       } catch (err) {
// //         setError('Failed to fetch problems. Please make sure the backend server is running.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     // Call the function
// //     fetchProblems();
// //   }, []); // The empty array [] means this effect runs only once

// //   // Render a loading spinner while data is being fetched
// //   if (loading) {
// //     return (
// //       <Container centerContent>
// //         <Spinner size="xl" />
// //       </Container>
// //     );
// //   }

// //   // Render an error message if fetching failed
// //   if (error) {
// //     return (
// //       <Container>
// //         <Alert status="error">
// //           <AlertIcon />
// //           {error}
// //         </Alert>
// //       </Container>
// //     );
// //   }

// //   // Render the table of problems if fetching was successful
// //   return (
// //     <Container maxW="container.lg">
// //       <VStack spacing={4} align="stretch">
// //         <Heading as="h2" size="lg">
// //           Problems
// //         </Heading>
// //         <Table variant="simple">
// //           <Thead>
// //             <Tr>
// //               <Th>Title</Th>
// //               <Th>Difficulty</Th>
// //               <Th>Tags</Th>
// //             </Tr>
// //           </Thead>
// //           <Tbody>
// //             {problems.map((problem) => (
// //               <Tr key={problem.id}>
// //                 <Td>{problem.title}</Td>
// //                 <Td>
// //                   <Badge 
// //                     colorScheme={
// //                       problem.difficulty === 'Easy' ? 'green' :
// //                       problem.difficulty === 'Medium' ? 'orange' : 'red'
// //                     }
// //                   >
// //                     {problem.difficulty}
// //                   </Badge>
// //                 </Td>
// //                 <Td>
// //                   <Text fontSize="sm" color="gray.500">
// //                     {problem.tags.join(', ')}
// //                   </Text>
// //                 </Td>
// //               </Tr>
// //             ))}
// //           </Tbody>
// //         </Table>
// //       </VStack>
// //     </Container>
// //   );
// // };

// // export default Problems;


// // src/pages/Problems.tsx
// import { useEffect, useState } from 'react';
// import {
//   Heading,
//   Container,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Spinner,
//   Alert,
//   AlertIcon,
//   VStack,
//   Text,
//   Badge,
//   Link as ChakraLink,
// } from '@chakra-ui/react';
// import { Link as RouterLink } from 'react-router-dom';
// import axios from 'axios';

// // Define a type for our problem data for TypeScript
// interface Problem {
//   id: number;
//   title: string;
//   difficulty: 'Easy' | 'Medium' | 'Hard';
//   tags: string[];
// }

// const Problems = () => {
//   // THESE LINES ARE LIKELY MISSING:
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // useEffect hook to fetch data when the component loads
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/problems/');
//         setProblems(response.data);
//       } catch (err) {
//         setError('Failed to fetch problems. Please make sure the backend server is running.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblems();
//   }, []);

//   if (loading) {
//     return (
//       <Container centerContent>
//         <Spinner size="xl" />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container>
//         <Alert status="error">
//           <AlertIcon />
//           {error}
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxW="container.lg">
//       <VStack spacing={4} align="stretch">
//         <Heading as="h2" size="lg">Problems</Heading>
//         <Table variant="simple">
//           <Thead>
//             <Tr>
//               <Th>Title</Th>
//               <Th>Difficulty</Th>
//               <Th>Tags</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {problems.map((problem) => (
//               <Tr key={problem.id} _hover={{ bg: 'gray.50', cursor: 'pointer' }}>
//                 <Td>
//                   <ChakraLink as={RouterLink} to={`/problems/${problem.id}`} fontWeight="medium">
//                     {problem.title}
//                   </ChakraLink>
//                 </Td>
//                 <Td>
//                   <Badge 
//                     colorScheme={
//                       problem.difficulty === 'Easy' ? 'green' :
//                       problem.difficulty === 'Medium' ? 'orange' : 'red'
//                     }
//                   >
//                     {problem.difficulty}
//                   </Badge>
//                 </Td>
//                 <Td>
//                   <Text fontSize="sm" color="gray.500">
//                     {problem.tags.join(', ')}
//                   </Text>
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </VStack>
//     </Container>
//   );
// };

// export default Problems;






// src/pages/Problems.tsx
import { useEffect, useState } from 'react';
import {
  Heading,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  Text,
  Badge,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

// Define a type for our problem data for TypeScript
interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

const Problems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/problems/');
        setProblems(response.data);
      } catch (err) {
        setError('Failed to fetch problems. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8} color="gray.100">
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="lg" color="gray.100">
          Problems
        </Heading>

        <Table
          variant="simple"
          // lighten borders in dark mode so rows remain visible
          sx={{
            'th, td': { borderColor: 'whiteAlpha.200' },
          }}
        >
          <Thead>
            <Tr>
              <Th color="gray.400">Title</Th>
              <Th color="gray.400">Difficulty</Th>
              <Th color="gray.400">Tags</Th>
            </Tr>
          </Thead>

          <Tbody>
            {problems.map((problem) => (
              <Tr
                key={problem.id}
                _hover={{ bg: 'whiteAlpha.100', cursor: 'pointer' }} // subtle dark hover
              >
                <Td>
                  <ChakraLink
                    as={RouterLink}
                    to={`/problems/${problem.id}`}
                    fontWeight="medium"
                    color="teal.200"
                    _hover={{ color: 'teal.100', textDecoration: 'none' }}
                  >
                    {problem.title}
                  </ChakraLink>
                </Td>

                <Td>
                  <Badge
                    colorScheme={
                      problem.difficulty === 'Easy'
                        ? 'green'
                        : problem.difficulty === 'Medium'
                        ? 'orange'
                        : 'red'
                    }
                  >
                    {problem.difficulty}
                  </Badge>
                </Td>

                <Td>
                  <Text fontSize="sm" color="gray.300">
                    {problem.tags.join(', ')}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

export default Problems;
