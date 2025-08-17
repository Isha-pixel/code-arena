// // import { useEffect, useState } from 'react';
// // import api from '../services/apiClient';
// // import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

// // type MeResp = {
// //   user:{id:number;username:string;email:string};
// //   total_submissions:number;
// //   solved_count:number;
// //   difficulty_breakdown:Record<string,number>;
// //   recent_submissions:any[];
// // };

// // export default function Profile(){
// //   const [me,setMe]=useState<MeResp|null>(null);
// //   useEffect(()=>{ (async()=>{ const r=await api.get('/me/summary/'); setMe(r.data); })(); },[]);
// //   return (
// //     <Box p={8} color="white">
// //       <Heading size="lg" mb={6}>Profile</Heading>
// //       <SimpleGrid columns={[1,3]} spacing={6} mb={6}>
// //         <Stat bg="#121826" p={4} borderRadius="md"><StatLabel>Total submissions</StatLabel><StatNumber>{me?.total_submissions ?? 0}</StatNumber></Stat>
// //         <Stat bg="#121826" p={4} borderRadius="md"><StatLabel>Problems solved</StatLabel><StatNumber>{me?.solved_count ?? 0}</StatNumber></Stat>
// //         <Stat bg="#121826" p={4} borderRadius="md">
// //           <StatLabel>By difficulty</StatLabel>
// //           <StatHelpText>
// //             {Object.entries(me?.difficulty_breakdown || {}).map(([k,v])=>`${k}:${v}`).join('  ')}
// //           </StatHelpText>
// //         </Stat>
// //       </SimpleGrid>

// //       <Heading size="md" mb={2}>Recent submissions</Heading>
// //       <Table variant="simple" colorScheme="gray" size="sm">
// //         <Thead><Tr><Th>Problem</Th><Th>Lang</Th><Th>Verdict</Th><Th>When</Th></Tr></Thead>
// //         <Tbody>
// //           {(me?.recent_submissions||[]).map((s,i)=>(
// //             <Tr key={i}><Td>{s.problem_title}</Td><Td>{s.language}</Td><Td>{s.verdict}</Td><Td>{String(s.submitted_at).replace('T',' ').slice(0,19)}</Td></Tr>
// //           ))}
// //         </Tbody>
// //       </Table>
// //     </Box>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Table, Thead, Tr, Th, Tbody, Td, Tag } from "@chakra-ui/react";
// import dayjs from "dayjs";
// import api from "../services/apiClient";

// type Submission = {
//   id: number;
//   problem: string;         // title only (from your serializer)
//   code: string;
//   language: "python" | "cpp" | "java";
//   verdict: string;         // "Accepted" | "Wrong Answer" | "Runtime Error" ...
//   execution_time?: number; // seconds
//   submitted_at: string;    // ISO
// };

// type ProblemLite = { id: number; title: string; difficulty?: string };

// export default function Profile() {
//   const [subs, setSubs] = useState<Submission[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [byDiff, setByDiff] = useState<Record<string, number>>({});
//   const [solved, setSolved]   = useState(0);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         // pull problems once to map title -> difficulty
//         const probs = await api.get<ProblemLite[]>("/problems/");
//         const titleToDiff = new Map<string, string>();
//         for (const p of probs.data) titleToDiff.set(p.title, (p as any).difficulty || "Unknown");

//         // user-only submissions
//         const r = await api.get<Submission[]>("/submissions/");
//         if (!alive) return;

//         const data = r.data ?? [];
//         setSubs(data);

//         // solved = unique problems with Accepted
//         const acceptedTitles = new Set(
//           data.filter(s => /accepted/i.test(s.verdict)).map(s => s.problem)
//         );
//         setSolved(acceptedTitles.size);

//         // difficulty breakdown (of accepted)
//         const diffCounter: Record<string, number> = {};
//         for (const t of acceptedTitles) {
//           const d = titleToDiff.get(t) || "Unknown";
//           diffCounter[d] = (diffCounter[d] || 0) + 1;
//         }
//         setByDiff(diffCounter);
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   const recent = [...subs].sort((a,b) =>
//     +new Date(b.submitted_at) - +new Date(a.submitted_at)
//   ).slice(0, 10);

//   return (
//     <Box w="100%" px={6} py={6}>
//       <Heading size="lg" mb={5}>Profile</Heading>

//       <SimpleGrid columns={[1,3]} spacing={4} mb={6}>
//         <Stat bg="#111827" border="1px solid #1f2937" p={4} borderRadius="md">
//           <StatLabel>Total submissions</StatLabel>
//           <StatNumber>{loading ? "…" : subs.length}</StatNumber>
//         </Stat>
//         <Stat bg="#111827" border="1px solid #1f2937" p={4} borderRadius="md">
//           <StatLabel>Problems solved</StatLabel>
//           <StatNumber>{loading ? "…" : solved}</StatNumber>
//         </Stat>
//         <Stat bg="#111827" border="1px solid #1f2937" p={4} borderRadius="md">
//           <StatLabel>By difficulty</StatLabel>
//           <StatNumber>
//             {loading ? "…" : Object.entries(byDiff).map(([k,v]) => (
//               <Tag key={k} mr={2} colorScheme={
//                 k.toLowerCase() === "easy" ? "green" :
//                 k.toLowerCase() === "medium" ? "yellow" :
//                 k.toLowerCase() === "hard" ? "red" : "gray"
//               }>{k}: {v}</Tag>
//             ))}
//           </StatNumber>
//         </Stat>
//       </SimpleGrid>

//       <Heading size="md" mb={3}>Recent submissions</Heading>
//       <Box border="1px solid" borderColor="whiteAlpha.200" borderRadius="md" overflowX="auto">
//         <Table size="sm" variant="simple">
//           <Thead>
//             <Tr>
//               <Th>Problem</Th>
//               <Th>Lang</Th>
//               <Th>Verdict</Th>
//               <Th isNumeric>Time (s)</Th>
//               <Th>When</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {recent.map(s => (
//               <Tr key={s.id}>
//                 <Td>{s.problem}</Td>
//                 <Td>{s.language}</Td>
//                 <Td>
//                   <Tag colorScheme={
//                     /accepted/i.test(s.verdict) ? "green" :
//                     /runtime/i.test(s.verdict) ? "orange" : "red"
//                   }>
//                     {s.verdict}
//                   </Tag>
//                 </Td>
//                 <Td isNumeric>{s.execution_time?.toFixed?.(3) ?? "-"}</Td>
//                 <Td>{dayjs(s.submitted_at).format("YYYY-MM-DD HH:mm:ss")}</Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </Box>
//     </Box>
//   );
// }





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
