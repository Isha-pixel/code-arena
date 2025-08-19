// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Table, Thead, Tr, Th, Tbody, Td, Button, HStack, Skeleton, Text, Link, Tag
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import api from '../services/apiClient';
import useAuth from '../hooks/useAuth';

type Recent = {
  id:number;
  problem_id:number;
  problem_title:string;
  language:string;
  verdict:string;
  execution_time:number;
  submitted_at:string;
};

type Summary = {
  user?: { id:number; username:string; email?:string };
  total_submissions:number;
  solved_count:number;
  difficulty_breakdown:Record<string,number>;
  recent_submissions:Recent[];
};

type Submission = {
  id:number; problem:string; language:string; verdict:string;
  execution_time?:number; submitted_at:string;
};
type ProblemLite = { id:number; title:string; difficulty?:string };

const MBox = motion(Box);
const cardAnim = { initial:{opacity:0, y:12}, animate:{opacity:1, y:0}, transition:{duration:.3} };
const verdictStyles = (v:string) => /accepted/i.test((v||'').trim())
  ? { bg:'green.500', color:'white' } : { bg:'red.500', color:'white' };

export default function Dashboard(){
  const { authed } = useAuth();
  const [data, setData] = useState<Summary|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    if (!authed) { setLoading(false); return; }

    let alive = true;

    const buildClientSummary = async (): Promise<Summary> => {
      const [subsRes, probsRes] = await Promise.all([
        api.get<Submission[]>('/submissions/'),
        api.get<ProblemLite[]>('/problems/'),
      ]);
      const subs = subsRes.data ?? [];
      const probs = probsRes.data ?? [];

      const titleToDiff = new Map<string,string>();
      for (const p of probs) titleToDiff.set(p.title, (p as any).difficulty || 'Unknown');

      const accepted = subs.filter(s => /accepted/i.test(s.verdict));
      const solvedSet = new Set(accepted.map(s => s.problem));

      const diff: Record<string,number> = {};
      for (const title of solvedSet) {
        const d = titleToDiff.get(title) || 'Unknown';
        diff[d] = (diff[d] || 0) + 1;
      }

      const recent: Recent[] = [...subs]
        .sort((a,b)=> +new Date(b.submitted_at) - +new Date(a.submitted_at))
        .slice(0,10)
        .map((s, i) => ({
          id: s.id,
          problem_id: probs.find(p => p.title === s.problem)?.id ?? i, // best effort
          problem_title: s.problem,
          language: s.language,
          verdict: s.verdict,
          execution_time: s.execution_time ?? 0,
          submitted_at: s.submitted_at,
        }));

      return {
        total_submissions: subs.length,
        solved_count: solvedSet.size,
        difficulty_breakdown: diff,
        recent_submissions: recent,
      };
    };

    (async ()=>{
      try {
        // Try server summary first (fast + cheap if you add it later)
        const r = await api.get<Summary>('/me/summary/');
        if (alive && r?.data && typeof r.data.total_submissions === 'number') {
          setData(r.data);
          return;
        }
        // Fall back
        const fallback = await buildClientSummary();
        if (alive) setData(fallback);
      } catch {
        // Any error -> fallback
        try {
          const fallback = await buildClientSummary();
          if (alive) setData(fallback);
        } catch {
          if (alive) setData({
            total_submissions: 0,
            solved_count: 0,
            difficulty_breakdown: {},
            recent_submissions: [],
          });
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return ()=>{ alive=false; };
  }, [authed]);

  if (!authed) {
    return (
      <Box p={10} color="white">
        <Heading size="lg" mb={4}>Welcome to your Dashboard</Heading>
        <Text mb={6} color="gray.300">Log in to see your stats, recent submissions and quick actions.</Text>
        <HStack>
          <Button as={RouterLink} to="/login" colorScheme="teal">Login</Button>
          <Button as={RouterLink} to="/register" variant="outline" colorScheme="teal">Create account</Button>
        </HStack>
      </Box>
    );
  }

  return (
    <Box p={8} color="white">
      <HStack justify="space-between" align="center" mb={6}>
        <Heading size="lg">Dashboard</Heading>
        <HStack>
          <Button as={RouterLink} to="/problems" colorScheme="teal">Solve Problems</Button>
          <Button as={RouterLink} to="/contests" variant="outline" colorScheme="teal">Upcoming Contests</Button>
        </HStack>
      </HStack>

      <SimpleGrid columns={[1,3]} spacing={6} mb={6}>
        <MBox {...cardAnim} p={4} bg="#121826" borderRadius="md" border="1px solid" borderColor="whiteAlpha.200">
          {loading ? <Skeleton h="80px" /> : (
            <Stat>
              <StatLabel>Total submissions</StatLabel>
              <StatNumber>{data?.total_submissions ?? 0}</StatNumber>
            </Stat>
          )}
        </MBox>

        <MBox {...cardAnim} p={4} bg="#121826" borderRadius="md" border="1px solid" borderColor="whiteAlpha.200" transition={{duration:.3, delay:.05}}>
          {loading ? <Skeleton h="80px" /> : (
            <Stat>
              <StatLabel>Problems solved</StatLabel>
              <StatNumber>{data?.solved_count ?? 0}</StatNumber>
            </Stat>
          )}
        </MBox>

        <MBox {...cardAnim} p={4} bg="#121826" borderRadius="md" border="1px solid" borderColor="whiteAlpha.200" transition={{duration:.3, delay:.1}}>
          {loading ? <Skeleton h="80px" /> : (
            <Stat>
              <StatLabel>By difficulty</StatLabel>
              <StatHelpText>
                {data && Object.keys(data.difficulty_breakdown).length
                  ? Object.entries(data.difficulty_breakdown).map(([k,v])=>`${k}: ${v}`).join('   ')
                  : '—'}
              </StatHelpText>
            </Stat>
          )}
        </MBox>
      </SimpleGrid>

      <MBox {...cardAnim} p={4} bg="#121826" borderRadius="md" border="1px solid" borderColor="whiteAlpha.200">
        <Heading size="md" mb={3}>Recent submissions</Heading>
        {loading ? (
          <Skeleton h="160px" />
        ) : (
          <>
            {!data?.recent_submissions?.length ? (
              <Text color="gray.400">
                No submissions yet. <Link as={RouterLink} to="/problems" color="teal.200">Start solving →</Link>
              </Text>
            ) : (
              <Table size="sm" variant="simple" colorScheme="gray">
                <Thead><Tr><Th>Problem</Th><Th>Lang</Th><Th>Verdict</Th><Th isNumeric>Time (s)</Th><Th>When</Th></Tr></Thead>
                <Tbody>
                  {data.recent_submissions.map((s) => (
                    <Tr key={s.id}>
                      <Td><Link as={RouterLink} to={`/problems/${s.problem_id}`}>{s.problem_title}</Link></Td>
                      <Td>{s.language}</Td>
                      <Td><Tag size="sm" borderRadius="md" px={2} py={1} {...verdictStyles(s.verdict)}>{s.verdict}</Tag></Td>
                      <Td isNumeric>{s.execution_time ?? 0}</Td>
                      <Td>{String(s.submitted_at).replace('T',' ').slice(0,19)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}
      </MBox>
    </Box>
  );
}
