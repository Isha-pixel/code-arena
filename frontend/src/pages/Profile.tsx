//frontend/pages/Profile.tsx
import { useEffect, useState } from "react";
import {
  Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber,
  Table, Thead, Tr, Th, Tbody, Td, Tag
} from "@chakra-ui/react";
import dayjs from "dayjs";
import api from "../services/apiClient";

// put this near the top of each file
const verdictStyles = (v: string) =>
  /accepted/i.test((v || '').trim())
    ? { bg: 'green.500', color: 'white' }
    : { bg: 'red.500', color: 'white' };


type Submission = {
  id: number;
  problem: string;
  code: string;
  language: "python" | "cpp" | "java" | string;
  verdict: string;
  execution_time?: number;
  submitted_at: string;
};

type ProblemLite = { id: number; title: string; difficulty?: string };

const isAccepted = (v: string) => /^(ac|accepted)$/i.test((v || '').trim());
const tagProps = (v: string) =>
  ({ colorScheme: isAccepted(v) ? 'green' : 'red', variant: 'solid' as const });

export default function Profile() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [byDiff, setByDiff] = useState<Record<string, number>>({});
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const probs = await api.get<ProblemLite[]>("/problems/");
        const titleToDiff = new Map<string, string>();
        for (const p of probs.data) titleToDiff.set(p.title, (p as any).difficulty || "Unknown");

        const r = await api.get<Submission[]>("/submissions/");
        if (!alive) return;

        const data = r.data ?? [];
        setSubs(data);

        const acceptedTitles = new Set(
          data.filter(s => isAccepted(s.verdict)).map(s => s.problem)
        );
        setSolved(acceptedTitles.size);

        const diffCounter: Record<string, number> = {};
        for (const t of acceptedTitles) {
          const d = titleToDiff.get(t) || "Unknown";
          diffCounter[d] = (diffCounter[d] || 0) + 1;
        }
        setByDiff(diffCounter);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const recent = [...subs]
    .sort((a, b) => +new Date(b.submitted_at) - +new Date(a.submitted_at))
    .slice(0, 10);

  return (
    <Box w="100%" px={6} py={6} color="gray.100">
      <Heading size="lg" mb={5}>Profile</Heading>

      <SimpleGrid columns={[1, 3]} spacing={4} mb={6}>
        <Stat bg="#111827" border="1px solid #1f2937" p={4} borderRadius="md">
          <StatLabel>Total submissions</StatLabel>
          <StatNumber>{loading ? "…" : subs.length}</StatNumber>
        </Stat>

        <Stat bg="#111827" border="1px solid #1f2937" p={4} borderRadius="md">
          <StatLabel>Problems solved</StatLabel>
          <StatNumber>{loading ? "…" : solved}</StatNumber>
        </Stat>

        <Stat bg="#111827" border="1px solid #1f2937" p={4} borderRadius="md">
          <StatLabel>By difficulty</StatLabel>
          <StatNumber>
            {loading ? "…" : Object.entries(byDiff).map(([k, v]) => (
              <Tag key={k} mr={2} colorScheme={
                k.toLowerCase() === "easy" ? "green" :
                k.toLowerCase() === "medium" ? "yellow" :
                k.toLowerCase() === "hard" ? "red" : "gray"
              }>
                {k}: {v}
              </Tag>
            ))}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      <Heading size="md" mb={3}>Recent submissions</Heading>
      <Box border="1px solid" borderColor="whiteAlpha.200" borderRadius="md" overflowX="auto">
        <Table size="sm" variant="simple" sx={{ 'th, td': { borderColor: 'whiteAlpha.200' } }}>
          <Thead>
            <Tr>
              <Th>Problem</Th>
              <Th>Lang</Th>
              <Th>Verdict</Th>
              <Th isNumeric>Time (s)</Th>
              <Th>When</Th>
            </Tr>
          </Thead>
          <Tbody>
            {recent.map(s => (
              <Tr key={s.id}>
                <Td>{s.problem}</Td>
                <Td>{s.language}</Td>
                <Td>
                    <Tag size="sm" borderRadius="md" px={2} py={1} {...verdictStyles(s.verdict)}>
                        {s.verdict}
                    </Tag>
                </Td>

                <Td isNumeric>{s.execution_time?.toFixed?.(3) ?? "-"}</Td>
                <Td>{dayjs(s.submitted_at).format("YYYY-MM-DD HH:mm:ss")}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
