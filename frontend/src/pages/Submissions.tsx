//frontend/pages/Submissions.tsx
import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { Box, Heading, Table, Thead, Tr, Th, Tbody, Td, Tag } from '@chakra-ui/react';

// put this near the top of each file
const verdictStyles = (v: string) =>
  /accepted/i.test((v || '').trim())
    ? { bg: 'green.500', color: 'white' }
    : { bg: 'red.500', color: 'white' };

    
type S = {
  id: number;
  problem: string;
  code: string;
  language: string;
  verdict: string;
  execution_time: number;
  submitted_at: string;
};

const isAccepted = (v: string) => /^(ac|accepted)$/i.test((v || '').trim());
const tagProps = (v: string) =>
  ({ colorScheme: isAccepted(v) ? 'green' : 'red', variant: 'solid' as const });

export default function Submissions() {
  const [items, setItems] = useState<S[]>([]);

  useEffect(() => {
    (async () => {
      const r = await api.get('/submissions/');
      setItems(r.data || []);
    })();
  }, []);

  return (
    <Box p={8} color="white">
      <Heading size="lg" mb={4}>My Submissions</Heading>

      <Table variant="simple" colorScheme="gray" size="sm"
        sx={{ 'th, td': { borderColor: 'whiteAlpha.200' } }}>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Problem</Th>
            <Th>Lang</Th>
            <Th>Verdict</Th>
            <Th isNumeric>Time (s)</Th>
            <Th>When</Th>
          </Tr>
        </Thead>

        <Tbody>
          {items.map((s, i) => (
            <Tr key={s.id}>
              <Td>{i + 1}</Td>
              <Td>{s.problem}</Td>
              <Td>{s.language}</Td>
              <Td>
                <Tag size="sm" borderRadius="md" px={2} py={1} {...verdictStyles(s.verdict)}>
                  {s.verdict}
                </Tag>
              </Td>

              <Td isNumeric>{s.execution_time ?? 0}</Td>
              <Td>{s.submitted_at?.toString()?.replace('T', ' ').slice(0, 19)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
