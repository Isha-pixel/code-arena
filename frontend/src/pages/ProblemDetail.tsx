// // src/pages/ProblemDetail.tsx
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Box,
//   Heading,
//   Text,
//   Spinner,
//   Alert,
//   AlertIcon,
//   VStack,
//   Divider,
//   Button,
//   Select,
//   Container,
// } from '@chakra-ui/react';
// import Editor from '@monaco-editor/react';
// import axios from 'axios';

// interface ProblemDetail {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: string;
//   tags: string[];
// }

// const ProblemDetail = () => {
//   const { problemId } = useParams<{ problemId: string }>();
//   const [problem, setProblem] = useState<ProblemDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [code, setCode] = useState<string>('');
//   const [language, setLanguage] = useState<string>('python');

//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         // CORRECTED THE IP ADDRESS IN THIS LINE:
//         const response = await axios.get(`http://127.0.0.1:8000/api/problems/${problemId}/`);
//         setProblem(response.data);
//       } catch (err) {
//         setError('Failed to fetch problem details.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   if (loading) return <Container centerContent><Spinner size="xl" /></Container>;
//   if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

//   return (
//     <VStack spacing={8} align="stretch" p={8}>
//       <Box>
//         <Heading as="h1" size="xl">{problem?.title}</Heading>
//         <Text mt={2} color="gray.500">Difficulty: {problem?.difficulty}</Text>
//       </Box>

//       <Divider />

//       <Box>
//         <Heading as="h2" size="lg" mb={4}>Problem Description</Heading>
//         <Text whiteSpace="pre-wrap">{problem?.description}</Text>
//       </Box>

//       <Divider />

//       <Box>
//         <Heading as="h2" size="lg" mb={4}>Your Solution</Heading>
//         <Select value={language} onChange={(e) => setLanguage(e.target.value)} mb={4} maxW="200px">
//           <option value="python">Python</option>
//           <option value="cpp">C++</option>
//           <option value="java">Java</option>
//         </Select>
//         <Box border="1px" borderColor="gray.200" borderRadius="md">
//           <Editor
//             height="50vh"
//             language={language}
//             value={code}
//             onChange={(value) => setCode(value || '')}
//             theme="vs-dark"
//           />
//         </Box>
//         <Button mt={4} colorScheme="teal">Submit</Button>
//       </Box>
//     </VStack>
//   );
// };

// export default ProblemDetail;


// // src/pages/ProblemDetail.tsx
// import api from '../services/apiClient';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Box,
//   Heading,
//   Text,
//   Spinner,
//   Alert,
//   AlertIcon,
//   VStack,
//   Divider,
//   Button,
//   Select,
//   Container,
//   useToast,
// } from '@chakra-ui/react';
// import Editor from '@monaco-editor/react';
// import axios from 'axios';


// interface ProblemDetail {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: string;
//   tags: string[];
// }

// // language → default code
// const STARTER: Record<string, string> = {
//   python: `n = int(input().strip())
// print(n)
// `,
//   cpp: `#include <bits/stdc++.h>
// using namespace std;
// int main(){ ios::sync_with_stdio(false); cin.tie(nullptr);
//   long long n; if(!(cin>>n)) return 0;
//   cout<<n<<'\\n';
//   return 0;
// }
// `,
//   java: `import java.util.*; public class Main{
//   public static void main(String[] args){ Scanner sc=new Scanner(System.in);
//     long n = sc.nextLong(); System.out.println(n);
//   }
// }
// `,
// };

// export default function ProblemDetail() {
//   const { problemId } = useParams<{ problemId: string }>();

//   const [problem, setProblem] = useState<ProblemDetail | null>(null);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState<string | null>(null);

//   const [code, setCode]         = useState<string>('');
//   const [language, setLanguage] = useState<string>('python');

//   // NEW: submission UI state
//   const toast = useToast();
//   const [submitting, setSubmitting] = useState(false);
//   const [runResult, setRunResult]   = useState<any>(null);

//   // Load problem details
//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const res = await axios.get(`http://127.0.0.1:8000/api/problems/${problemId}/`);
//         setProblem(res.data);
//       } catch {
//         setError('Failed to fetch problem details.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   // Set a default template the first time the page loads
//   useEffect(() => {
//     // only set if the editor is empty
//     if (!code) setCode(STARTER[language] ?? '');
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [problemId]); // run when you open a different problem

//   // NEW: submit handler calling your Django submit action
//   async function handleSubmit() {
//     if (!problemId) return;
//     setSubmitting(true);
//     setRunResult(null);
//     try {
//       // const r = await axios.post(
//       //   `http://127.0.0.1:8000/api/problems/${problemId}/submit/`,
//       //   { code, language },
//       //   { withCredentials: true } // keep for now; switch to JWT Authorization header later
//       // );
//       const r = await api.post(`/api/problems/${problemId}/submit/`, { code, language });
//       setRunResult(r.data);
//       toast({ status: 'success', title: r.data.verdict });
//     } catch (e: any) {
//       toast({
//         status: 'error',
//         title: 'Submission failed',
//         description: e?.response?.data?.detail || String(e),
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading) {
//     return (
//       <Container centerContent>
//         <Spinner size="xl" />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Alert status="error">
//         <AlertIcon />
//         {error}
//       </Alert>
//     );
//   }

//   return (
//     <VStack spacing={8} align="stretch">
//       <Box>
//         <Heading as="h1" size="xl">{problem?.title}</Heading>
//         <Text mt={2} color="gray.500">Difficulty: {problem?.difficulty}</Text>
//       </Box>

//       <Divider />

//       <Box>
//         <Heading as="h2" size="lg" mb={4}>Problem Description</Heading>
//         <Text whiteSpace="pre-wrap">{problem?.description}</Text>
//       </Box>

//       <Divider />

//       <Box>
//         <Heading as="h2" size="lg" mb={4}>Your Solution</Heading>

//         <Select
//           value={language}
//           onChange={(e) => {
//             const newLang = e.target.value;
//             setLanguage(newLang);
//             // If user hasn't typed or is still on the previous starter, load the new starter
//             if (!code || code === STARTER[language]) {
//               setCode(STARTER[newLang] ?? '');
//             }
//           }}
//           mb={4}
//           maxW="200px"
//         >
//           <option value="python">Python</option>
//           <option value="cpp">C++</option>
//           <option value="java">Java</option>
//         </Select>


//         <Box border="1px" borderColor="gray.200" borderRadius="md">
//           <Editor
//             height="50vh"
//             language={language}
//             value={code}
//             onChange={(val) => setCode(val || '')}
//             theme="vs-dark"
//           />
//         </Box>

//         <Button mt={4} colorScheme="teal" onClick={handleSubmit} isLoading={submitting}>
//           Submit
//         </Button>

//         <Button
//           variant="outline"
//           ml={3}
//           mt={4}
//           onClick={() => setCode(STARTER[language] ?? '')}
//         >
//           Reset template
//         </Button>

//         {runResult && (
//           <Box mt={6} p={4} border="1px" borderColor="gray.200" borderRadius="md">
//             <Heading size="md" mb={2}>
//               {runResult.verdict} — {runResult.passed}/{runResult.total} passed
//             </Heading>

//             {runResult.results?.map((r: any) => (
//               <Box key={r.test_case} mb={3} fontSize="sm">
//                 <b>Test {r.test_case}:</b> {r.passed ? '✓ Passed' : '✗ Failed'}
//                 {r.expected !== undefined && (
//                   <>
//                     <br />Expected: <code>{r.expected}</code>
//                     <br />Your Output: <code>{r.actual}</code>
//                   </>
//                 )}
//                 {r.error && (
//                   <>
//                     <br />Error: <code>{r.error}</code>
//                   </>
//                 )}
//                 {r.runtime_ms !== undefined && (
//                   <>
//                     <br />Runtime: {r.runtime_ms} ms
//                   </>
//                 )}
//               </Box>
//             ))}

//             <Box mt={2} color="gray.600" fontSize="sm">
//               Total runtime: {runResult.total_runtime_ms} ms
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </VStack>
//   );
// }



// // src/pages/ProblemDetail.tsx
// import api from '../services/apiClient';
// import { useEffect, useMemo, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Box,
//   Heading,
//   Text,
//   Spinner,
//   Alert,
//   AlertIcon,
//   VStack,
//   Button,
//   Select,
//   Container,
//   useToast,
//   HStack,
//   Tag,
//   Wrap,
//   WrapItem,
//   Divider,
// } from '@chakra-ui/react';
// import Editor from '@monaco-editor/react';
// import axios from 'axios';

// // ---------- constants ----------
// const EDITOR_H = '70vh';         // stable editor height
// const MIN_LEFT = 300;            // px
// const MIN_RIGHT = 520;           // px
// const SPLIT_LS_KEY = 'oj:split:leftPx';

// // ---------- types ----------
// interface ProblemDetail {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: string;
//   tags: string[];
//   // public_tests?: { id: number; input_text: string; expected_text: string; }[];
// }

// type SubmitResultItem = {
//   test_case: number | string;
//   passed: boolean;
//   expected?: string;
//   actual?: string;
//   error?: string;
//   runtime_ms?: number;
// };

// type SubmitResponseShapeA = {
//   verdict: string;
//   passed: number;
//   total: number;
//   total_runtime_ms?: number;
//   results?: SubmitResultItem[];
// };

// type SubmitResponseShapeB = {
//   overall_verdict: string;
//   breakdown: { id: number | string; visibility: 'public' | 'hidden'; status: string; timeMs?: number }[];
// };

// function toChipVerdicts(data: SubmitResponseShapeA | SubmitResponseShapeB) {
//   if ((data as SubmitResponseShapeB).overall_verdict) {
//     const b = data as SubmitResponseShapeB;
//     return {
//       overall: b.overall_verdict,
//       chips: b.breakdown.map((t, i) => ({
//         key: t.id ?? i,
//         label: `${t.visibility === 'public' ? 'Sample' : 'Hidden'} ${i + 1}`,
//         ok: t.status === 'AC',
//       })),
//       meta: { total_runtime_ms: undefined as number | undefined },
//     };
//   }
//   const a = data as SubmitResponseShapeA;
//   return {
//     overall: a.verdict,
//     chips: (a.results ?? []).map((r, i) => ({
//       key: r.test_case ?? i,
//       label: `Test ${r.test_case ?? i + 1}`,
//       ok: !!r.passed,
//     })),
//     meta: { total_runtime_ms: a.total_runtime_ms },
//   };
// }

// // ---------- starters ----------
// const STARTER: Record<string, string> = {
//   python: `# read all input and print it back (demo)
// import sys
// data = sys.stdin.read().strip()
// print(data)
// `,
//   cpp: `#include <bits/stdc++.h>
// using namespace std;
// int main(){ ios::sync_with_stdio(false); cin.tie(nullptr);
//   string s, all; while (getline(cin, s)) { all += s; all += "\\n"; }
//   cout << all;
//   return 0;
// }
// `,
//   java: `import java.util.*; import java.io.*;
// public class Main{
//   public static void main(String[] args) throws Exception{
//     BufferedReader br=new BufferedReader(new InputStreamReader(System.in));
//     StringBuilder sb=new StringBuilder(); String ln;
//     while((ln=br.readLine())!=null) sb.append(ln).append("\\n");
//     System.out.print(sb.toString());
//   }
// }
// `,
// };

// export default function ProblemDetail() {
//   const { problemId } = useParams<{ problemId: string }>();

//   const [problem, setProblem] = useState<ProblemDetail | null>(null);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState<string | null>(null);

//   const [code, setCode]         = useState<string>('');
//   const [language, setLanguage] = useState<string>('python');

//   // custom run I/O
//   const [customIn, setCustomIn]   = useState<string>('');
//   const [customOut, setCustomOut] = useState<string>('');
//   const [running, setRunning]     = useState<boolean>(false);

//   // submission UI state
//   const toast = useToast();
//   const [submitting, setSubmitting] = useState(false);
//   const [submitData, setSubmitData] = useState<SubmitResponseShapeA | SubmitResponseShapeB | null>(null);

//   // ----- load problem -----
//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const res = await axios.get(`http://127.0.0.1:8000/api/problems/${problemId}/`);
//         setProblem(res.data);
//       } catch {
//         setError('Failed to fetch problem details.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProblem();
//   }, [problemId]);

//   // ----- persist editor code per user/problem/language -----
//   const userKey = 'guest'; // replace with actual user id if you have auth
//   const lsKey = useMemo(
//     () => `oj:code:${userKey}:${problemId}:${language}`,
//     [userKey, problemId, language]
//   );

//   useEffect(() => {
//     const cached = localStorage.getItem(lsKey);
//     if (cached !== null) setCode(cached);
//     else setCode(STARTER[language] ?? '');
//   }, [lsKey, language]);

//   const saveTimer = useRef<number | undefined>(undefined);
//   const onChangeCode = (val: string) => {
//     setCode(val);
//     window.clearTimeout(saveTimer.current);
//     saveTimer.current = window.setTimeout(() => {
//       localStorage.setItem(lsKey, val);
//     }, 300);
//   };

//   // ----- resizable split -----
//   const splitRef = useRef<HTMLDivElement>(null);
//   const [containerW, setContainerW] = useState<number>(0);
//   const [leftPx, setLeftPx] = useState<number>(() => {
//     const fromLS = Number(localStorage.getItem(SPLIT_LS_KEY));
//     return Number.isFinite(fromLS) && fromLS > 0 ? fromLS : 420;
//   });
//   const [dragging, setDragging] = useState(false);

//   // measure container width & clamp left pane
//   useEffect(() => {
//     const measure = () => {
//       const w = splitRef.current?.offsetWidth ?? window.innerWidth;
//       setContainerW(w);
//       setLeftPx(prev => {
//         const maxLeft = Math.max(MIN_LEFT, w - MIN_RIGHT);
//         return Math.min(Math.max(prev, MIN_LEFT), maxLeft);
//       });
//     };
//     measure();
//     const ro = new ResizeObserver(measure);
//     if (splitRef.current) ro.observe(splitRef.current);
//     window.addEventListener('resize', measure);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener('resize', measure);
//     };
//   }, []);

//   // drag handlers
//   useEffect(() => {
//     if (!dragging) return;
//     const onMove = (e: MouseEvent | TouchEvent) => {
//       const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
//       const rect = splitRef.current?.getBoundingClientRect();
//       if (!rect) return;
//       const x = clientX - rect.left;
//       const maxLeft = Math.max(MIN_LEFT, containerW - MIN_RIGHT);
//       const next = Math.min(Math.max(x, MIN_LEFT), maxLeft);
//       setLeftPx(next);
//       localStorage.setItem(SPLIT_LS_KEY, String(next));
//     };
//     const onUp = () => setDragging(false);

//     window.addEventListener('mousemove', onMove);
//     window.addEventListener('mouseup', onUp);
//     window.addEventListener('touchmove', onMove, { passive: false });
//     window.addEventListener('touchend', onUp);
//     return () => {
//       window.removeEventListener('mousemove', onMove);
//       window.removeEventListener('mouseup', onUp);
//       window.removeEventListener('touchmove', onMove as any);
//       window.removeEventListener('touchend', onUp);
//     };
//   }, [dragging, containerW]);

//   const isStacked = containerW < 900; // auto-stack on narrow screens

//   // ----- handlers -----
//   async function handleRun() {
//     setRunning(true);
//     setCustomOut('');
//     try {
//       const r = await api.post(`/problems/${problemId}/run/`, { code, language, stdin: customIn });
//       const d = r.data as { stdout?: string; stderr?: string; timeMs?: number };
//       setCustomOut((d.stdout ?? '') + (d.stderr ? `\n[stderr]\n${d.stderr}` : ''));
//     } catch (e: any) {
//       setCustomOut(`(demo) custom run not wired yet.\nImplement POST /api/problems/${problemId}/run/ to execute code with provided stdin.\n\nError: ${e?.response?.data?.detail ?? String(e)}`);
//     } finally {
//       setRunning(false);
//     }
//   }

//   async function handleSubmit() {
//     if (!problemId) return;
//     setSubmitting(true);
//     setSubmitData(null);
//     try {
//       const r = await api.post(`/problems/${problemId}/submit/`, { code, language });
//       setSubmitData(r.data);
//       const chips = toChipVerdicts(r.data);
//       toast({ status: chips.overall === 'Accepted' ? 'success' : 'error', title: chips.overall });
//     } catch (e: any) {
//       toast({
//         status: 'error',
//         title: 'Submission failed',
//         description: e?.response?.data?.detail || String(e),
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // ----- render -----
//   if (loading) {
//     return (
//       <Container centerContent>
//         <Spinner size="xl" />
//       </Container>
//     );
//   }
//   if (error) {
//     return (
//       <Alert status="error">
//         <AlertIcon />
//         {error}
//       </Alert>
//     );
//   }

//   const chips = submitData ? toChipVerdicts(submitData) : null;

//   return (
//     <Box w="100vw" maxW="100%" px={{ base: 4, md: 6 }} py={4}>
//       <VStack spacing={4} align="stretch">
//         <Box>
//           <Heading as="h1" size="xl">{problem?.title}</Heading>
//           <Text mt={1} color="gray.500">Difficulty: {problem?.difficulty}</Text>
//         </Box>

//         {/* Resizable split container */}
//         <Box
//           ref={splitRef}
//           w="100%"
//           // min height gives that “full page” feel; tweak if you have a fixed header
//           minH="calc(100vh - 160px)"
//         >
//           {isStacked ? (
//             // Mobile / narrow: stack vertically (no handle)
//             <VStack align="stretch" spacing={4}>
//               {/* Problem (white) */}
//               <Box
//                 bg="white" color="gray.900" border="1px" borderColor="gray.200"
//                 borderRadius="md" p={5} boxShadow="sm"
//                 minH={EDITOR_H} overflowY="auto"
//                 sx={{
//                   "pre, code": {
//                     background: "gray.50",
//                     color: "gray.800",
//                     borderRadius: "md",
//                     border: "1px solid",
//                     borderColor: "gray.200",
//                     padding: "12px",
//                     whiteSpace: "pre-wrap",
//                   },
//                 }}
//               >
//                 <Heading as="h2" size="md" mb={3} color="gray.900">Problem</Heading>
//                 <Text whiteSpace="pre-wrap" color="gray.800">{problem?.description}</Text>
//               </Box>

//               {/* Solution (dark) */}
//               <SolutionPane
//                 language={language}
//                 setLanguage={setLanguage}
//                 code={code}
//                 onChangeCode={onChangeCode}
//                 customIn={customIn}
//                 setCustomIn={setCustomIn}
//                 customOut={customOut}
//                 running={running}
//                 handleRun={handleRun}
//                 submitting={submitting}
//                 handleSubmit={handleSubmit}
//                 chips={chips}
//                 lsKey={lsKey}
//               />
//             </VStack>
//           ) : (
//             // Desktop: full-width grid with draggable handle
//             <Box
//               display="grid"
//               gridTemplateColumns={`${leftPx}px 10px 1fr`}
//               columnGap={0}
//               w="100%"
//             >
//               {/* LEFT */}
//               <Box
//                 bg="white" color="gray.900" borderRight="1px" borderColor="gray.200"
//                 p={5} minH={EDITOR_H} overflowY="auto"
//                 sx={{
//                   "pre, code": {
//                     background: "gray.50",
//                     color: "gray.800",
//                     borderRadius: "md",
//                     border: "1px solid",
//                     borderColor: "gray.200",
//                     padding: "12px",
//                     whiteSpace: "pre-wrap",
//                   },
//                 }}
//               >
//                 <Heading as="h2" size="md" mb={3} color="gray.900">Problem</Heading>
//                 <Text whiteSpace="pre-wrap" color="gray.800">{problem?.description}</Text>
//               </Box>

//               {/* HANDLE */}
//               <Box
//                 role="separator"
//                 aria-orientation="vertical"
//                 cursor="col-resize"
//                 onMouseDown={() => setDragging(true)}
//                 onTouchStart={() => setDragging(true)}
//                 display="flex"
//                 alignItems="stretch"
//                 justifyContent="center"
//                 bg="transparent"
//                 _hover={{ bg: 'blackAlpha.200' }}
//               >
//                 <Box w="2px" bg="blackAlpha.400" my={2} borderRadius="full" />
//               </Box>

//               {/* RIGHT */}
//               <SolutionPane
//                 language={language}
//                 setLanguage={setLanguage}
//                 code={code}
//                 onChangeCode={onChangeCode}
//                 customIn={customIn}
//                 setCustomIn={setCustomIn}
//                 customOut={customOut}
//                 running={running}
//                 handleRun={handleRun}
//                 submitting={submitting}
//                 handleSubmit={handleSubmit}
//                 chips={chips}
//                 lsKey={lsKey}
//               />
//             </Box>
//           )}
//         </Box>

//         <Divider opacity={0.1} />
//       </VStack>
//     </Box>
//   );
// }

// /* ---------- Right Pane as a tiny component to keep things tidy ---------- */
// type SolutionProps = {
//   language: string;
//   setLanguage: (v: string) => void;
//   code: string;
//   onChangeCode: (v: string) => void;
//   customIn: string;
//   setCustomIn: (v: string) => void;
//   customOut: string;
//   running: boolean;
//   handleRun: () => void;
//   submitting: boolean;
//   handleSubmit: () => void;
//   chips: null | { overall: string; chips: { key: string | number; label: string; ok: boolean }[]; meta: { total_runtime_ms?: number | undefined } };
//   lsKey: string;
// };

// function SolutionPane({
//   language, setLanguage, code, onChangeCode,
//   customIn, setCustomIn, customOut, running, handleRun,
//   submitting, handleSubmit, chips, lsKey
// }: SolutionProps) {

//   return (
//     <Box borderLeft="1px" borderColor="gray.700" borderRadius="md" p={4} bg="#111317" color="whiteAlpha.900">
//       <Heading as="h2" size="md" mb={3} color="whiteAlpha.900">Your Solution</Heading>

//       <HStack spacing={3} mb={3}>
//         <Select
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           maxW="200px"
//           bg="#151922"
//           borderColor="gray.700"
//           color="whiteAlpha.900"
//         >
//           <option value="python">Python</option>
//           <option value="cpp">C++</option>
//           <option value="java">Java</option>
//         </Select>

//         <Button colorScheme="teal" onClick={handleSubmit} isLoading={submitting}>
//           Submit
//         </Button>

//         {/* white reset button */}
//         <Button
//           bg="white"
//           color="gray.900"
//           border="1px solid"
//           borderColor="gray.300"
//           _hover={{ bg: 'gray.50' }}
//           onClick={() => {
//             // reset to starter for current language
//             const s = STARTER[language] ?? '';
//             onChangeCode(s);
//             localStorage.setItem(lsKey, s);
//           }}
//         >
//           Reset template
//         </Button>
//       </HStack>

//       <Box border="1px" borderColor="gray.700" borderRadius="md">
//         <Editor
//           height={EDITOR_H}
//           language={language === 'cpp' ? 'cpp' : language}
//           value={code}
//           onChange={(val) => onChangeCode(val || '')}
//           theme="vs-dark"
//           options={{ minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14 }}
//         />
//       </Box>

//       {/* Custom Input/Output */}
//       <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} mt={4}>
//         <Box>
//           <Text fontWeight="bold" mb={2} color="whiteAlpha.900">Input</Text>
//           <Box
//             as="textarea"
//             value={customIn}
//             onChange={(e: any) => setCustomIn(e.target.value)}
//             height="170px"
//             width="100%"
//             p={3}
//             bg="#0e1116"
//             color="whiteAlpha.900"
//             border="1px solid"
//             borderColor="gray.700"
//             borderRadius="md"
//           />
//           <Button mt={2} onClick={handleRun} isLoading={running}>
//             {running ? 'Running…' : 'Run'}
//           </Button>
//         </Box>

//         <Box>
//           <Text fontWeight="bold" mb={2} color="whiteAlpha.900">Output</Text>
//           <Box
//             as="pre"
//             height="170px"
//             p={3}
//             bg="#0e1116"
//             color="whiteAlpha.900"
//             border="1px solid"
//             borderColor="gray.700"
//             borderRadius="md"
//             overflowY="auto"
//           >
//             {customOut}
//           </Box>
//         </Box>
//       </Box>

//       {/* Verdict chips */}
//       <Box mt={4}>
//         {!chips ? (
//           <Text color="gray.400">Submit to see verdicts here.</Text>
//         ) : (
//           <>
//             <Box
//               p={2}
//               borderRadius="md"
//               fontWeight="bold"
//               color={chips.overall === 'Accepted' ? 'green.300' : 'red.300'}
//               bg={chips.overall === 'Accepted' ? '#0f2f19' : '#2f1212'}
//               border="1px solid"
//               borderColor={chips.overall === 'Accepted' ? '#234b32' : '#4b2323'}
//             >
//               Result: {chips.overall}
//             </Box>

//             <Wrap spacing="8px" mt={3}>
//               {chips.chips.map((c) => (
//                 <WrapItem key={c.key}>
//                   <Tag size="md" colorScheme={c.ok ? 'green' : 'red'} variant="subtle">
//                     {c.label}: {c.ok ? 'AC' : 'Fail'}
//                   </Tag>
//                 </WrapItem>
//               ))}
//             </Wrap>

//             {chips.meta.total_runtime_ms != null && (
//               <Text mt={2} color="gray.400" fontSize="sm">
//                 Total runtime: {chips.meta.total_runtime_ms} ms
//               </Text>
//             )}
//           </>
//         )}
//       </Box>
//     </Box>
//   );
// }



// // src/pages/ProblemDetail.tsx
// import api from '../services/apiClient';
// import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
// import { Link as RouterLink, useParams } from 'react-router-dom';
// import {
//   Box, Heading, Text, Spinner, Alert, AlertIcon, Button, Select, HStack,
//   Wrap, WrapItem, Tag, Tabs, TabList, TabPanels, Tab, TabPanel, Link, useToast,
// } from '@chakra-ui/react';
// import Editor from '@monaco-editor/react';
// import axios from 'axios';

// /* ---------------- Error Boundary ---------------- */
// class ErrorBoundary extends Component<{ children: React.ReactNode }, { err: any }> {
//   constructor(props: { children: React.ReactNode }) { super(props); this.state = { err: null }; }
//   static getDerivedStateFromError(err: any) { return { err }; }
//   componentDidCatch(err: any, info: any) { console.error('ProblemDetail error:', err, info); }
//   render() {
//     if (this.state.err) {
//       return (
//         <Box bg="#0d1016" color="red.200" p={6}>
//           <Heading size="md" mb={3}>Something went wrong in ProblemDetail</Heading>
//           <Box as="pre" whiteSpace="pre-wrap">{String(this.state.err?.stack || this.state.err)}</Box>
//         </Box>
//       );
//     }
//     return this.props.children as React.ReactElement;
//   }
// }

// /* ---------------- layout constants ---------------- */
// const APP_BG     = '#0d1016';
// const CARD_DARK  = '#131722';
// const CARD_LIGHT = '#ffffff';
// // shorter editor so IO fits on screen; tweak if you like
// const EDITOR_H   = 'clamp(340px, 60vh, 72vh)';
// const IO_H       = 'clamp(120px, 20vh, 260px)';
// const MIN_LEFT_PCT = 28;
// const MAX_LEFT_PCT = 55;
// const SPLIT_LS_KEY = 'oj:split:leftPct';

// /* ---------------- types ---------------- */
// interface ProblemDetailDto {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: string;
//   tags?: string[];
// }

// type SubmitItem = {
//   test_case: number | string;
//   passed: boolean;
//   expected?: string; actual?: string; error?: string; runtime_ms?: number;
// };
// type SubmitRespA = { verdict: string; passed: number; total: number; total_runtime_ms?: number; results?: SubmitItem[]; };
// type SubmitRespB = { overall_verdict: string; breakdown: { id: number | string; visibility: 'public' | 'hidden'; status: string; timeMs?: number }[]; };

// function toChips(data: SubmitRespA | SubmitRespB) {
//   if ((data as SubmitRespB).overall_verdict) {
//     const b = data as SubmitRespB;
//     return { overall: b.overall_verdict, chips: b.breakdown.map((t, i) => ({ key: t.id ?? i, label: `${t.visibility === 'public' ? 'Sample' : 'Hidden'} ${i + 1}`, ok: t.status === 'AC' })) };
//   }
//   const a = data as SubmitRespA;
//   return { overall: a.verdict, chips: (a.results ?? []).map((r, i) => ({ key: r.test_case ?? i, label: `Test ${r.test_case ?? i + 1}`, ok: !!r.passed })) };
// }

// /* ---------------- starters ---------------- */
// const STARTER: Record<string, string> = {
//   python: `# read all input and print it back (demo)
// import sys
// data = sys.stdin.read().strip()
// print(data)
// `,
//   cpp: `#include <bits/stdc++.h>
// using namespace std;
// int main(){ ios::sync_with_stdio(false); cin.tie(nullptr);
//   string s, all; while(getline(cin,s)){ all+=s; all+="\\n"; }
//   cout<<all; return 0;
// }
// `,
//   java: `import java.io.*; public class Main{
//   public static void main(String[] args) throws Exception{
//     var br=new BufferedReader(new InputStreamReader(System.in));
//     var sb=new StringBuilder(); String ln;
//     while((ln=br.readLine())!=null) sb.append(ln).append("\\n");
//     System.out.print(sb.toString());
//   }
// }
// `,
// };

// export default function ProblemDetail() {
//   return (
//     <ErrorBoundary>
//       <ProblemDetailInner />
//     </ErrorBoundary>
//   );
// }

// function ProblemDetailInner() {
//   const { problemId } = useParams<{ problemId: string }>();
//   const toast = useToast();

//   /* ----- problem ----- */
//   const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   /* ----- editor ----- */
//   const [language, setLanguage] = useState('python');
//   const [code, setCode] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [running, setRunning] = useState(false);

//   /* ----- IO & verdict ----- */
//   const [customIn, setCustomIn] = useState('');
//   const [runStdout, setRunStdout] = useState('');
//   const [submitData, setSubmitData] = useState<SubmitRespA | SubmitRespB | null>(null);

//   /* ----- split ratio ----- */
//   const splitRef = useRef<HTMLDivElement>(null);
//   const [leftPct, setLeftPct] = useState<number>(() => {
//     const fromLS = Number(localStorage.getItem(SPLIT_LS_KEY));
//     return Number.isFinite(fromLS) && fromLS > 0 ? fromLS : 38;
//   });
//   const [dragging, setDragging] = useState(false);

//   /* fetch problem */
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const r = await axios.get<ProblemDetailDto>(`http://127.0.0.1:8000/api/problems/${problemId}/`);
//         if (!alive) return;
//         setProblem(r.data);
//       } catch (e: any) {
//         console.error(e);
//         if (!alive) return;
//         setErr('Failed to fetch problem details.');
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, [problemId]);

//   /* code persistence */
//   const userKey = 'guest';
//   const codeKey = useMemo(() => `oj:code:${userKey}:${problemId}:${language}`, [userKey, problemId, language]);
//   useEffect(() => {
//     const cached = localStorage.getItem(codeKey);
//     setCode(cached ?? STARTER[language] ?? '');
//   }, [codeKey, language]);
//   const saveTimer = useRef<number | undefined>();
//   const onChangeCode = (v: string) => {
//     setCode(v);
//     window.clearTimeout(saveTimer.current);
//     saveTimer.current = window.setTimeout(() => localStorage.setItem(codeKey, v), 250);
//   };

//   /* drag splitter */
//   useEffect(() => {
//     const onMove = (e: MouseEvent | TouchEvent) => {
//       if (!dragging || !splitRef.current) return;
//       const rect = splitRef.current.getBoundingClientRect();
//       const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
//       const pct = ((clientX - rect.left) / rect.width) * 100;
//       const clamped = Math.max(MIN_LEFT_PCT, Math.min(MAX_LEFT_PCT, pct));
//       setLeftPct(clamped);
//       localStorage.setItem(SPLIT_LS_KEY, String(clamped));
//       (e as any).preventDefault?.();
//     };
//     const onUp = () => setDragging(false);
//     if (dragging) {
//       window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
//       window.addEventListener('touchmove', onMove, { passive: false }); window.addEventListener('touchend', onUp);
//     }
//     return () => {
//       window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp);
//       window.removeEventListener('touchmove', onMove as any); window.removeEventListener('touchend', onUp);
//     };
//   }, [dragging]);

//   /* actions */
//   const doRun = async (stdin: string) => {
//     setRunning(true); setRunStdout('');
//     try {
//       // top RUN now always runs with Custom Input
//       const r = await api.post(`/problems/${problemId}/run/`, { code, language, stdin });
//       const d = r.data as { stdout?: string; stderr?: string; timeMs?: number };
//       setRunStdout((d.stdout ?? '') + (d.stderr ? `\n[stderr]\n${d.stderr}` : ''));
//     } catch (e: any) {
//       console.error(e);
//       setRunStdout(`Run failed.\n${e?.response?.data?.detail ?? String(e)}`);
//     } finally { setRunning(false); }
//   };

//   const doSubmit = async () => {
//     setSubmitting(true); setSubmitData(null);
//     try {
//       const r = await api.post(`/problems/${problemId}/submit/`, { code, language });
//       setSubmitData(r.data);
//       const mapped = toChips(r.data);
//       toast({ status: mapped.overall === 'Accepted' ? 'success' : 'error', title: mapped.overall });
//     } catch (e: any) {
//       console.error(e);
//       toast({ status: 'error', title: 'Submission failed', description: e?.response?.data?.detail || String(e) });
//     } finally { setSubmitting(false); }
//   };

//   const askAiReview = () => toast({ status: 'info', title: 'AI Review', description: 'Hook /problems/:id/review/ to enable.' });

//   /* render states */
//   if (loading) {
//     return (
//       <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center" bg={APP_BG}>
//         <Spinner size="xl" />
//       </Box>
//     );
//   }
//   if (err) {
//     return (
//       <Box w="100vw" minH="100vh" bg={APP_BG} p={6}>
//         <Alert status="error"><AlertIcon />{err}</Alert>
//       </Box>
//     );
//   }

//   /* ---------------- UI ---------------- */
//   return (
//     <Box w="100vw" minH="100vh" bg={APP_BG} color="gray.200">
//       {/* top bar */}
//       <Box px={6} py={4} display="flex" alignItems="center" justifyContent="space-between">
//         <Heading size="lg" color="gray.100">{problem?.title}</Heading>
//         <Link as={RouterLink} to="/problems" color="gray.300" _hover={{ color: 'gray.100' }}>
//           ⟵ Back to Problems
//         </Link>
//       </Box>

//       {/* split */}
//       <Box ref={splitRef} px={6} pb={6}>
//         <Box display="grid" gridTemplateColumns={`${leftPct}% 10px ${100 - leftPct}%`} columnGap={0} alignItems="start">
//           {/* LEFT: problem card */}
//           <Box bg={CARD_LIGHT} color="gray.900" borderRadius="10px" p={5} boxShadow="sm" minH={`calc(${EDITOR_H} + 200px)`} overflowY="auto">
//             <Wrap mb={3} spacing="8px">
//               {problem?.difficulty && (
//                 <WrapItem>
//                   <Tag colorScheme={problem?.difficulty.toLowerCase() === 'easy' ? 'green' :
//                     problem?.difficulty.toLowerCase() === 'medium' ? 'yellow' : 'red'}>
//                     {problem?.difficulty}
//                   </Tag>
//                 </WrapItem>
//               )}
//               {problem?.tags?.map((t) => (<WrapItem key={t}><Tag variant="subtle">{t}</Tag></WrapItem>))}
//             </Wrap>

//             <Heading size="md" mb={3} color="gray.900">Problem Statement</Heading>
//             <Text whiteSpace="pre-wrap" color="gray.800">{problem?.description}</Text>
//           </Box>

//           {/* HANDLE */}
//           <Box role="separator" aria-orientation="vertical" cursor="col-resize" onMouseDown={() => setDragging(true)}
//                onTouchStart={() => setDragging(true)} display="flex" alignItems="stretch" justifyContent="center"
//                _hover={{ bg: 'whiteAlpha.200' }} mx={2}>
//             <Box w="2px" bg="whiteAlpha.400" my={2} borderRadius="full" />
//           </Box>

//           {/* RIGHT: editor + IO + verdict + AI review */}
//           <Box bg={CARD_DARK} borderRadius="10px" p={4} border="1px solid" borderColor="whiteAlpha.200">
//             {/* toolbar */}
//             <HStack spacing={3} mb={3} justify="space-between">
//               <Select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 maxW="200px"
//                 bg="#1a2130"
//                 borderColor="whiteAlpha.300"
//                 color="whiteAlpha.900"
//               >
//                 <option value="python">Python</option>
//                 <option value="cpp">C++</option>
//                 <option value="java">Java</option>
//               </Select>

//               <HStack spacing={3}>
//                 {/* SINGLE Run button – uses Custom Input */}
//                 <Button onClick={() => doRun(customIn)} isLoading={running} leftIcon={<span>▶</span>}>
//                   Run
//                 </Button>
//                 <Button colorScheme="teal" onClick={doSubmit} isLoading={submitting} leftIcon={<span>✈</span>}>
//                   Submit
//                 </Button>
//                 <Button variant="outline" onClick={askAiReview}>
//                   Get AI Review
//                 </Button>
//               </HStack>
//             </HStack>

//             {/* editor */}
//             <Box border="1px" borderColor="whiteAlpha.200" borderRadius="8px" overflow="hidden">
//               <Editor
//                 height={EDITOR_H}
//                 language={language === 'cpp' ? 'cpp' : language}
//                 value={code}
//                 onChange={(v) => onChangeCode(v || '')}
//                 theme="vs-dark"
//                 options={{ automaticLayout: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 14 }}
//               />
//             </Box>

//             <Tabs variant="enclosed" mt={4} colorScheme="gray" defaultIndex={0}>
//               <TabList bg="#0f1420" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px 8px 0 0">
//                 <Tab>Custom Input</Tab>
//                 <Tab>Verdict</Tab>
//                 <Tab>AI Review</Tab>
//               </TabList>

//               <TabPanels border="1px solid" borderColor="whiteAlpha.200" borderTop="0" borderRadius="0 0 8px 8px" bg="#0f1420">
//                 {/* Custom Input panel – no extra Run button */}
//                 <TabPanel>
//                   <Text mb={2} fontWeight="semibold">Input (stdin)</Text>
//                   <Box
//                     as="textarea"
//                     value={customIn}
//                     onChange={(e: any) => setCustomIn(e.target.value)}
//                     p={3}
//                     border="1px solid"
//                     borderColor="whiteAlpha.300"
//                     borderRadius="8px"
//                     bg="#0e1116"
//                     color="whiteAlpha.900"
//                     w="100%"
//                     height={IO_H}
//                   />
//                   <Text mt={4} mb={2} fontWeight="semibold">Your Output (stdout)</Text>
//                   <Box
//                     as="pre"
//                     p={3}
//                     border="1px solid"
//                     borderColor="whiteAlpha.300"
//                     borderRadius="8px"
//                     bg="#0e1116"
//                     color="whiteAlpha.900"
//                     height={IO_H}
//                     overflowY="auto"
//                   >
//                     {runStdout || 'Run code to see output...'}
//                   </Box>
//                 </TabPanel>

//                 {/* Verdict */}
//                 <TabPanel>
//                   {!submitData ? (
//                     <Text color="whiteAlpha.700">Submit to see verdict.</Text>
//                   ) : (
//                     (() => {
//                       const mapped = toChips(submitData);
//                       return (
//                         <>
//                           <Box
//                             p={2}
//                             borderRadius="md"
//                             fontWeight="bold"
//                             color={mapped.overall === 'Accepted' ? 'green.300' : 'red.300'}
//                             bg={mapped.overall === 'Accepted' ? '#0f2f19' : '#2f1212'}
//                             border="1px solid"
//                             borderColor={mapped.overall === 'Accepted' ? '#234b32' : '#4b2323'}
//                             mb={3}
//                           >
//                             Result: {mapped.overall}
//                           </Box>
//                           <Wrap spacing="8px">
//                             {mapped.chips.map(c => (
//                               <WrapItem key={c.key}>
//                                 <Tag colorScheme={c.ok ? 'green' : 'red'}>{c.label}: {c.ok ? 'AC' : 'Fail'}</Tag>
//                               </WrapItem>
//                             ))}
//                           </Wrap>
//                         </>
//                       );
//                     })()
//                   )}
//                 </TabPanel>

//                 {/* AI Review – WHITE background */}
//                 <TabPanel p={0}>
//                   <Box bg="white" color="gray.800" p={4} borderRadius="0 0 8px 8px">
//                     <Text mb={3}>
//                       Ask an AI to review your code for complexity, edge cases, and style.
//                     </Text>
//                     <Button size="sm" onClick={askAiReview}>Get AI Review</Button>
//                   </Box>
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }







// // src/pages/ProblemDetail.tsx
// import api from '../services/apiClient';
// import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
// import { Link as RouterLink, useParams } from 'react-router-dom';
// import {
//   Box,
//   Heading,
//   Text,
//   Spinner,
//   Alert,
//   AlertIcon,
//   Button,
//   Select,
//   HStack,
//   Wrap,
//   WrapItem,
//   Tag,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   Link,
//   useToast,
// } from '@chakra-ui/react';
// import Editor from '@monaco-editor/react';

// /* ---------------- Error Boundary ---------------- */
// class ErrorBoundary extends Component<{ children: React.ReactNode }, { err: any }> {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { err: null };
//   }
//   static getDerivedStateFromError(err: any) {
//     return { err };
//   }
//   componentDidCatch(err: any, info: any) {
//     console.error('ProblemDetail error:', err, info);
//   }
//   render() {
//     if (this.state.err) {
//       return (
//         <Box bg="#0d1016" color="red.200" p={6}>
//           <Heading size="md" mb={3}>Something went wrong in ProblemDetail</Heading>
//           <Box as="pre" whiteSpace="pre-wrap">{String(this.state.err?.stack || this.state.err)}</Box>
//         </Box>
//       );
//     }
//     return this.props.children as React.ReactElement;
//   }
// }

// /* ---------------- layout constants ---------------- */
// const APP_BG       = '#0d1016';
// const CARD_DARK    = '#131722';
// const CARD_LIGHT   = '#ffffff';
// const EDITOR_H     = '60vh';           // pulled up so IO is visible
// const MIN_LEFT_PCT = 28;
// const MAX_LEFT_PCT = 55;
// const SPLIT_LS_KEY = 'oj:split:leftPct';

// /* ---------------- types ---------------- */

// interface ProblemDetailDto {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: string;
//   tags?: string[];
//   sample_input?: string | null;   // optional; not shown now (custom-only)
//   sample_output?: string | null;
// }

// type AiReview = {
//   verdict: string;
//   issues: string[];
//   suggestions: string[];
//   complexity: string;
//   explanation: string;
//   run?: { stdout?: string; stderr?: string };
// };


// type SubmitItem = {
//   test_case: number | string;
//   passed: boolean;
//   expected?: string; actual?: string; error?: string; runtime_ms?: number;
// };

// type SubmitRespA = {
//   verdict: string; passed: number; total: number;
//   total_runtime_ms?: number; results?: SubmitItem[];
// };

// type SubmitRespB = {
//   overall_verdict: string;
//   breakdown: { id: number | string; visibility: 'public' | 'hidden'; status: string; timeMs?: number }[];
// };

// function toChips(data: SubmitRespA | SubmitRespB) {
//   if ((data as SubmitRespB).overall_verdict) {
//     const b = data as SubmitRespB;
//     return {
//       overall: b.overall_verdict,
//       chips: b.breakdown.map((t, i) => ({ key: t.id ?? i, label: `${t.visibility === 'public' ? 'Sample' : 'Hidden'} ${i+1}`, ok: t.status === 'AC' || t.status === 'Accepted' })),
//     };
//   }
//   const a = data as SubmitRespA;
//   return {
//     overall: a.verdict,
//     chips: (a.results ?? []).map((r, i) => ({ key: r.test_case ?? i, label: `Test ${r.test_case ?? i+1}`, ok: !!r.passed })),
//   };
// }

// /* ---------------- starters ---------------- */
// const STARTER: Record<string, string> = {
//   python: `import sys
// data = sys.stdin.read().strip()
// print(data)
// `,
//   cpp: `#include <bits/stdc++.h>
// using namespace std;
// int main() {
//   ios::sync_with_stdio(false); cin.tie(nullptr);
//   string s, all; while (getline(cin, s)) { all += s; all += '\n'; }
//   cout << all;
//   return 0;
// }
// `,
//   java: `import java.io.*;
// public class Main {
//   public static void main(String[] args) throws Exception {
//     BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
//     StringBuilder sb = new StringBuilder(); String ln;
//     while ((ln = br.readLine()) != null) sb.append(ln).append('\n');
//     System.out.print(sb.toString());
//   }
// }
// `,
// };

// export default function ProblemDetail() {
//   return (
//     <ErrorBoundary>
//       <ProblemDetailInner />
//     </ErrorBoundary>
//   );
// }

// function ProblemDetailInner() {
//   const { problemId } = useParams<{ problemId: string }>();
//   const toast = useToast();
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiError, setAiError]     = useState<string | null>(null);
//   const [ai, setAi]               = useState<AiReview | null>(null);


//   /* ----- problem ----- */
//   const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   /* ----- editor ----- */
//   const [language, setLanguage] = useState<'python'|'cpp'|'java'>('python');
//   const [code, setCode] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [running, setRunning] = useState(false);

//   /* ----- IO & verdict ----- */
//   const [customIn, setCustomIn] = useState('');
//   const [runStdout, setRunStdout] = useState('');
//   const [submitData, setSubmitData] = useState<SubmitRespA | SubmitRespB | null>(null);

//   /* ----- split ratio ----- */
//   const splitRef = useRef<HTMLDivElement>(null);
//   const [leftPct, setLeftPct] = useState<number>(() => {
//     const fromLS = Number(localStorage.getItem(SPLIT_LS_KEY));
//     return Number.isFinite(fromLS) && fromLS > 0 ? fromLS : 38;
//   });
//   const [dragging, setDragging] = useState(false);

//   /* fetch problem */
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         // api baseURL = http://127.0.0.1:8000, so include /api here
//         const r = await api.get<ProblemDetailDto>(`/problems/${problemId}/`);
//         if (!alive) return;
//         setProblem(r.data);
//       } catch (e: any) {
//         console.error(e);
//         if (!alive) return;
//         setErr('Failed to fetch problem details.');
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, [problemId]);

//   /* code persistence */
//   const userKey = 'guest';
//   const codeKey = useMemo(
//     () => `oj:code:${userKey}:${problemId}:${language}`,
//     [userKey, problemId, language]
//   );
//   useEffect(() => {
//     const cached = localStorage.getItem(codeKey);
//     setCode(cached ?? STARTER[language] ?? '');
//   }, [codeKey, language]);
//   const saveTimer = useRef<number | undefined>();
//   const onChangeCode = (v: string) => {
//     setCode(v);
//     window.clearTimeout(saveTimer.current);
//     saveTimer.current = window.setTimeout(() => localStorage.setItem(codeKey, v), 250);
//   };

//   /* drag splitter */
//   useEffect(() => {
//     const onMove = (e: MouseEvent | TouchEvent) => {
//       if (!dragging || !splitRef.current) return;
//       const rect = splitRef.current.getBoundingClientRect();
//       const clientX = (e as TouchEvent).touches
//         ? (e as TouchEvent).touches[0].clientX
//         : (e as MouseEvent).clientX;
//       const pct = ((clientX - rect.left) / rect.width) * 100;
//       const clamped = Math.max(MIN_LEFT_PCT, Math.min(MAX_LEFT_PCT, pct));
//       setLeftPct(clamped);
//       localStorage.setItem(SPLIT_LS_KEY, String(clamped));
//       (e as any).preventDefault?.();
//     };
//     const onUp = () => setDragging(false);

//     if (dragging) {
//       window.addEventListener('mousemove', onMove);
//       window.addEventListener('mouseup', onUp);
//       window.addEventListener('touchmove', onMove, { passive: false });
//       window.addEventListener('touchend', onUp);
//     }
//     return () => {
//       window.removeEventListener('mousemove', onMove);
//       window.removeEventListener('mouseup', onUp);
//       window.removeEventListener('touchmove', onMove as any);
//       window.removeEventListener('touchend', onUp);
//     };
//   }, [dragging]);

//   /* actions */
//   const doRun = async () => {
//     setRunning(true); setRunStdout('');
//     try {
//       const r = await api.post(`/problems/${problemId}/run/`, { code, language, stdin: customIn ?? '' });
//       const d = r.data as { stdout?: string; stderr?: string; timeMs?: number };
//       setRunStdout((d.stdout ?? '') + (d.stderr ? `\n[stderr]\n${d.stderr}` : ''));
//     } catch (e: any) {
//       console.error(e);
//       setRunStdout(`Run failed.\n${e?.response?.data?.detail ?? String(e)}`);
//     } finally { setRunning(false); }
//   };

//   const doSubmit = async () => {
//     setSubmitting(true); setSubmitData(null);
//     try {
//       const r = await api.post(`/problems/${problemId}/submit/`, { code, language });
//       setSubmitData(r.data);
//       const mapped = toChips(r.data);
//       toast({ status: (mapped.overall === 'AC' || mapped.overall === 'Accepted') ? 'success' : 'error', title: mapped.overall });
//     } catch (e: any) {
//       console.error(e);
//       toast({ status: 'error', title: 'Submission failed', description: e?.response?.data?.detail || String(e) });
//     } finally { setSubmitting(false); }
//   };

//   const askAiReview = async () => {
//     // guard
//     if (!code?.trim()) {
//       toast({ status: 'warning', title: 'Write some code first' });
//       return;
//     }

//     setAiLoading(true);
//     setAiError(null);
//     setAi(null);

//     try {
//       const { data } = await api.post(`/problems/${problemId}/review/`, {
//         language,
//         code,
//         stdin: customIn ?? '',
//       });
//       setAi(data as AiReview);
//       toast({ status: 'success', title: 'AI review ready' });
//     } catch (e: any) {
//       const msg =
//         e?.response?.data?.detail ||
//         e?.message ||
//         'AI review failed';
//       setAiError(msg);
//       toast({ status: 'error', title: 'AI review failed', description: msg });
//     } finally {
//       setAiLoading(false);
//     }
//   };


//   /* render states */
//   if (loading) {
//     return (
//       <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center" bg={APP_BG}>
//         <Spinner size="xl" />
//       </Box>
//     );
//   }
//   if (err) {
//     return (
//       <Box w="100vw" minH="100vh" bg={APP_BG} p={6}>
//         <Alert status="error"><AlertIcon />{err}</Alert>
//       </Box>
//     );
//   }

//   /* ---------------- UI ---------------- */
//   return (
//     <Box w="100vw" minH="100vh" bg={APP_BG} color="gray.200">
//       {/* top bar */}
//       <Box px={6} py={4} display="flex" alignItems="center" justifyContent="space-between">
//         <Heading size="lg" color="gray.100">{problem?.title}</Heading>
//         <Link as={RouterLink} to="/problems" color="gray.300" _hover={{ color: 'gray.100' }}>
//           ⟵ Back to Problems
//         </Link>
//       </Box>

//       {/* split */}
//       <Box ref={splitRef} px={6} pb={6}>
//         <Box
//           display="grid"
//           gridTemplateColumns={`${leftPct}% 10px ${100 - leftPct}%`}
//           columnGap={0}
//           alignItems="stretch"                 // stretch both columns
//           minH="calc(100vh - 170px)"           // full page height for the row
//         >
//           {/* LEFT: problem card */}
//           <Box
//             bg={CARD_LIGHT}
//             color="gray.900"
//             borderRadius="10px"
//             p={5}
//             boxShadow="sm"
//             h="100%"                              // fill grid row height
//             overflowY="auto"
//           >
//             <Wrap mb={3} spacing="8px">
//               {problem?.difficulty && (
//                 <WrapItem>
//                   <Tag colorScheme={
//                     problem?.difficulty.toLowerCase() === 'easy' ? 'green' :
//                     problem?.difficulty.toLowerCase() === 'medium' ? 'yellow' : 'red'
//                   }>
//                     {problem?.difficulty}
//                   </Tag>
//                 </WrapItem>
//               )}
//               {problem?.tags?.map((t) => (
//                 <WrapItem key={t}><Tag variant="subtle">{t}</Tag></WrapItem>
//               ))}
//             </Wrap>

//             <Heading size="md" mb={3} color="gray.900">Problem Statement</Heading>
//             <Text whiteSpace="pre-wrap" color="gray.800">{problem?.description}</Text>
//           </Box>

//           {/* HANDLE */}
//           <Box
//             role="separator"
//             aria-orientation="vertical"
//             cursor="col-resize"
//             onMouseDown={() => setDragging(true)}
//             onTouchStart={() => setDragging(true)}
//             display="flex"
//             alignItems="stretch"
//             justifyContent="center"
//             _hover={{ bg: 'whiteAlpha.200' }}
//             mx={2}
//           >
//             <Box w="2px" bg="whiteAlpha.400" my={2} borderRadius="full" />
//           </Box>

//           {/* RIGHT: editor & tabs */}
//           <Box bg={CARD_DARK} borderRadius="10px" p={4} border="1px solid" borderColor="whiteAlpha.200">
//             {/* toolbar */}
//             <HStack spacing={3} mb={3} justify="space-between">
//               <Select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value as any)}
//                 maxW="200px"
//                 bg="#1a2130"
//                 borderColor="whiteAlpha.300"
//                 color="whiteAlpha.900"
//               >
//                 <option value="python">Python</option>
//                 <option value="cpp">C++</option>
//                 <option value="java">Java</option>
//               </Select>

//               <HStack spacing={3}>
//                 <Button onClick={doRun} isLoading={running} leftIcon={<span>▶</span>}>
//                   Run
//                 </Button>
//                 <Button colorScheme="teal" onClick={doSubmit} isLoading={submitting} leftIcon={<span>✈</span>}>
//                   Submit
//                 </Button>
//                 <Button
//                   onClick={askAiReview}
//                   bg="white"
//                   color="gray.800"
//                   _hover={{ bg: 'whiteAlpha.900' }}
//                   border="1px solid"
//                   borderColor="blackAlpha.200"
//                 >
//                   Get AI Review
//                 </Button>
//               </HStack>
//             </HStack>

//             {/* editor */}
//             <Box border="1px" borderColor="whiteAlpha.200" borderRadius="8px" overflow="hidden">
//               <Editor
//                 height={EDITOR_H}
//                 language={language === 'cpp' ? 'cpp' : language}
//                 value={code}
//                 onChange={(v) => onChangeCode(v || '')}
//                 theme="vs-dark"
//                 options={{
//                   automaticLayout: true,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   fontSize: 14,
//                 }}
//               />
//             </Box>

//             {/* tabs */}
//             <Tabs variant="enclosed" mt={4} colorScheme="gray">
//               <TabList bg="#0f1420" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px 8px 0 0">
//                 <Tab>Custom Input</Tab>
//                 <Tab>Verdict</Tab>
//                 <Tab>AI Review</Tab>
//               </TabList>

//               <TabPanels border="1px solid" borderColor="whiteAlpha.200" borderTop="0" borderRadius="0 0 8px 8px" bg="#0f1420">
//                 {/* Custom Input */}
//                 <TabPanel>
//                   <Text mb={2} fontWeight="semibold">Input (stdin)</Text>
//                   <Box
//                     as="textarea"
//                     value={customIn}
//                     onChange={(e: any) => setCustomIn(e.target.value)}
//                     p={3}
//                     border="1px solid"
//                     borderColor="whiteAlpha.300"
//                     borderRadius="8px"
//                     bg="#0e1116"
//                     color="whiteAlpha.900"
//                     w="100%"
//                     minH="120px"
//                   />
//                   <Text mt={4} mb={2} fontWeight="semibold">Your Output (stdout)</Text>
//                   <Box as="pre" p={3} border="1px solid" borderColor="whiteAlpha.300" borderRadius="8px" bg="#0e1116" color="whiteAlpha.900" minH="84px">
//                     {runStdout || 'Run code to see output...'}
//                   </Box>
//                 </TabPanel>

//                 {/* Verdict */}
//                 <TabPanel>
//                   {!submitData ? (
//                     <Text color="whiteAlpha.700">Submit to see verdict.</Text>
//                   ) : (
//                     <>
//                       {(() => {
//                         const mapped = toChips(submitData);
//                         return (
//                           <>
//                             <Box
//                               p={2}
//                               borderRadius="md"
//                               fontWeight="bold"
//                               color={(mapped.overall === 'AC' || mapped.overall === 'Accepted') ? 'green.300' : 'red.300'}
//                               bg={(mapped.overall === 'AC' || mapped.overall === 'Accepted') ? '#0f2f19' : '#2f1212'}
//                               border="1px solid"
//                               borderColor={(mapped.overall === 'AC' || mapped.overall === 'Accepted') ? '#234b32' : '#4b2323'}
//                               mb={3}
//                             >
//                               Result: {mapped.overall}
//                             </Box>
//                             <Wrap spacing="8px">
//                               {mapped.chips.map(c => (
//                                 <WrapItem key={c.key}>
//                                   <Tag colorScheme={c.ok ? 'green' : 'red'}>{c.label}: {c.ok ? 'AC' : 'Fail'}</Tag>
//                                 </WrapItem>
//                               ))}
//                             </Wrap>
//                           </>
//                         );
//                       })()}
//                     </>
//                   )}
//                 </TabPanel>

//                 {/* AI Review */}
//                 <TabPanel>
//                   <Box
//                     bg="white"
//                     color="gray.900"
//                     p={4}
//                     borderRadius="8px"
//                     border="1px solid"
//                     borderColor="blackAlpha.200"
//                   >
//                     <Text mb={3}>
//                       Ask an AI to review your code for correctness, edge cases, complexity, and style.
//                     </Text>

//                     <HStack spacing={3} mb={4}>
//                       <Button
//                         onClick={askAiReview}
//                         isLoading={aiLoading}
//                         loadingText="Reviewing…"
//                         bg="white"
//                         color="gray.800"
//                         _hover={{ bg: 'whiteAlpha.900' }}
//                         border="1px solid"
//                         borderColor="blackAlpha.200"
//                       >
//                         Get AI Review
//                       </Button>
//                       {aiError && (
//                         <Box color="red.600" fontSize="sm">
//                           {aiError}
//                         </Box>
//                       )}
//                     </HStack>

//                     {!ai && !aiError && !aiLoading && (
//                       <Text color="gray.600">No review yet. Click “Get AI Review”.</Text>
//                     )}

//                     {ai && (
//                       <Box>
//                         <Box
//                           p={2}
//                           mb={3}
//                           fontWeight="bold"
//                           borderRadius="md"
//                           border="1px solid"
//                           borderColor="blackAlpha.200"
//                           bg={ai.verdict === 'correct' ? '#e9f7ef' :
//                               ai.verdict === 'wrong-answer' ? '#fdecea' :
//                               ai.verdict === 'runtime-error' ? '#fff4e5' : '#eef2ff'}
//                         >
//                           Verdict: {ai.verdict}
//                         </Box>

//                         {ai.explanation && (
//                           <>
//                             <Heading size="sm" mb={2}>Explanation</Heading>
//                             <Text whiteSpace="pre-wrap" mb={3}>{ai.explanation}</Text>
//                           </>
//                         )}

//                         {ai.complexity && (
//                           <>
//                             <Heading size="sm" mb={2}>Estimated complexity</Heading>
//                             <Text mb={3}>{ai.complexity}</Text>
//                           </>
//                         )}

//                         {Array.isArray(ai.issues) && ai.issues.length > 0 && (
//                           <>
//                             <Heading size="sm" mb={2}>Issues</Heading>
//                             <Box as="ul" pl={5} mb={3}>
//                               {ai.issues.map((it, i) => <li key={i}>{it}</li>)}
//                             </Box>
//                           </>
//                         )}

//                         {Array.isArray(ai.suggestions) && ai.suggestions.length > 0 && (
//                           <>
//                             <Heading size="sm" mb={2}>Suggestions</Heading>
//                             <Box as="ul" pl={5}>
//                               {ai.suggestions.map((it, i) => <li key={i}>{it}</li>)}
//                             </Box>
//                           </>
//                         )}

//                         {ai.run && (ai.run.stdout || ai.run.stderr) && (
//                           <>
//                             <Heading size="sm" mt={4} mb={2}>One test run (context)</Heading>
//                             {ai.run.stdout && (
//                               <>
//                                 <Text fontWeight="semibold">stdout</Text>
//                                 <Box as="pre" p={2} bg="#f7fafc" borderRadius="md" border="1px solid #e2e8f0" mb={2}>
//                                   {ai.run.stdout}
//                                 </Box>
//                               </>
//                             )}
//                             {ai.run.stderr && (
//                               <>
//                                 <Text fontWeight="semibold">stderr</Text>
//                                 <Box as="pre" p={2} bg="#fff5f5" borderRadius="md" border="1px solid #fed7d7">
//                                   {ai.run.stderr}
//                                 </Box>
//                               </>
//                             )}
//                           </>
//                         )}
//                       </Box>
//                     )}
//                   </Box>
//                 </TabPanel>

//               </TabPanels>
//             </Tabs>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }





// src/pages/ProblemDetail.tsx
import api from '../services/apiClient';
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Select,
  HStack,
  Wrap,
  WrapItem,
  Tag,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
  useToast,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';

/* ---------------- Error Boundary ---------------- */
class ErrorBoundary extends Component<{ children: React.ReactNode }, { err: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err: any) {
    return { err };
  }
  componentDidCatch(err: any, info: any) {
    console.error('ProblemDetail error:', err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <Box bg="#0d1016" color="red.200" p={6}>
          <Heading size="md" mb={3}>Something went wrong in ProblemDetail</Heading>
          <Box as="pre" whiteSpace="pre-wrap">{String(this.state.err?.stack || this.state.err)}</Box>
        </Box>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

/* ---------------- layout constants ---------------- */
const APP_BG       = '#0d1016';
const CARD_DARK    = '#131722';
const CARD_LIGHT   = '#ffffff';
const EDITOR_H     = '60vh';
const MIN_LEFT_PCT = 28;
const MAX_LEFT_PCT = 55;
const SPLIT_LS_KEY = 'oj:split:leftPct';

/* ---------------- types ---------------- */
interface ProblemDetailDto {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  tags?: string[];
  sample_input?: string | null;
  sample_output?: string | null;
}

type AiReview = {
  verdict: string;
  issues: string[];
  suggestions: string[];
  complexity: string; // always a string after normalization
  explanation: string;
  run?: { stdout?: string; stderr?: string };
};

type SubmitItem = {
  test_case: number | string;
  passed: boolean;
  expected?: string; actual?: string; error?: string; runtime_ms?: number;
};

type SubmitRespA = {
  verdict: string; passed: number; total: number;
  total_runtime_ms?: number; results?: SubmitItem[];
};

type SubmitRespB = {
  overall_verdict: string;
  breakdown: { id: number | string; visibility: 'public' | 'hidden'; status: string; timeMs?: number }[];
};

function toChips(data: SubmitRespA | SubmitRespB) {
  if ((data as SubmitRespB).overall_verdict) {
    const b = data as SubmitRespB;
    return {
      overall: b.overall_verdict,
      chips: b.breakdown.map((t, i) => ({ key: t.id ?? i, label: `${t.visibility === 'public' ? 'Sample' : 'Hidden'} ${i+1}`, ok: t.status === 'AC' || t.status === 'Accepted' })),
    };
  }
  const a = data as SubmitRespA;
  return {
    overall: a.verdict,
    chips: (a.results ?? []).map((r, i) => ({ key: r.test_case ?? i, label: `Test ${r.test_case ?? i+1}`, ok: !!r.passed })),
  };
}

/* ---------------- starters ---------------- */
const STARTER: Record<string, string> = {
  python: `import sys
data = sys.stdin.read().strip()
print(data)
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
  ios::sync_with_stdio(false); cin.tie(nullptr);
  string s, all; while (getline(cin, s)) { all += s; all += '\\n'; }
  cout << all;
  return 0;
}
`,
  java: `import java.io.*;
public class Main {
  public static void main(String[] args) throws Exception {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StringBuilder sb = new StringBuilder(); String ln;
    while ((ln = br.readLine()) != null) sb.append(ln).append('\\n');
    System.out.print(sb.toString());
  }
}
`,
};

/* ---------------- helpers: normalize AI response ---------------- */
function normalizeAi(raw: any): AiReview {
  // verdict
  const verdict = String(raw?.verdict ?? raw?.status ?? 'incomplete');

  // issues / suggestions
  const issues = Array.isArray(raw?.issues)
    ? raw.issues.map((x: any) => String(x))
    : [];
  const suggestions = Array.isArray(raw?.suggestions)
    ? raw.suggestions.map((x: any) => String(x))
    : [];

  // complexity can be string | object | list; make it a single string
  let complexity = '';
  const c = raw?.complexity;
  if (typeof c === 'string') {
    complexity = c;
  } else if (c && typeof c === 'object' && !Array.isArray(c)) {
    const time  = c.time  ?? c.Time  ?? c.time_complexity  ?? '';
    const space = c.space ?? c.Space ?? c.space_complexity ?? '';
    const parts = [];
    if (time)  parts.push(`Time: ${time}`);
    if (space) parts.push(`Space: ${space}`);
    complexity = parts.join(', ');
  } else if (Array.isArray(c)) {
    complexity = c.map((x) => String(x)).join(', ');
  } else {
    complexity = '';
  }

  // explanation
  const explanation = String(raw?.explanation ?? '');

  // run (make sure strings)
  const run = raw?.run
    ? {
        stdout: raw.run.stdout != null ? String(raw.run.stdout) : undefined,
        stderr: raw.run.stderr != null ? String(raw.run.stderr) : undefined,
      }
    : undefined;

  return { verdict, issues, suggestions, complexity, explanation, run };
}

export default function ProblemDetail() {
  return (
    <ErrorBoundary>
      <ProblemDetailInner />
    </ErrorBoundary>
  );
}

function ProblemDetailInner() {
  const { problemId } = useParams<{ problemId: string }>();
  const toast = useToast();

  /* ----- AI review state ----- */
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]     = useState<string | null>(null);
  const [ai, setAi]               = useState<AiReview | null>(null);

  /* ----- problem ----- */
  const [problem, setProblem] = useState<ProblemDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  /* ----- editor ----- */
  const [language, setLanguage] = useState<'python'|'cpp'|'java'>('python');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);

  /* ----- IO & verdict ----- */
  const [customIn, setCustomIn] = useState('');
  const [runStdout, setRunStdout] = useState('');
  const [submitData, setSubmitData] = useState<SubmitRespA | SubmitRespB | null>(null);

  /* ----- split ratio ----- */
  const splitRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useState<number>(() => {
    const fromLS = Number(localStorage.getItem(SPLIT_LS_KEY));
    return Number.isFinite(fromLS) && fromLS > 0 ? fromLS : 38;
  });
  const [dragging, setDragging] = useState(false);

  /* fetch problem */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.get<ProblemDetailDto>(`/problems/${problemId}/`);
        if (!alive) return;
        setProblem(r.data);
      } catch (e: any) {
        console.error(e);
        if (!alive) return;
        setErr('Failed to fetch problem details.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [problemId]);

  /* code persistence */
  const userKey = 'guest';
  const codeKey = useMemo(
    () => `oj:code:${userKey}:${problemId}:${language}`,
    [userKey, problemId, language]
  );
  useEffect(() => {
    const cached = localStorage.getItem(codeKey);
    setCode(cached ?? STARTER[language] ?? '');
  }, [codeKey, language]);
  const saveTimer = useRef<number | undefined>();
  const onChangeCode = (v: string) => {
    setCode(v);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => localStorage.setItem(codeKey, v), 250);
  };

  /* drag splitter */
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const clientX = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(MIN_LEFT_PCT, Math.min(MAX_LEFT_PCT, pct));
      setLeftPct(clamped);
      localStorage.setItem(SPLIT_LS_KEY, String(clamped));
      (e as any).preventDefault?.();
    };
    const onUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);

  /* actions */
  const doRun = async () => {
    setRunning(true); setRunStdout('');
    try {
      const r = await api.post(`/problems/${problemId}/run/`, { code, language, stdin: customIn ?? '' });
      const d = r.data as { stdout?: string; stderr?: string; timeMs?: number };
      setRunStdout((d.stdout ?? '') + (d.stderr ? `\n[stderr]\n${d.stderr}` : ''));
    } catch (e: any) {
      console.error(e);
      setRunStdout(`Run failed.\n${e?.response?.data?.detail ?? String(e)}`);
    } finally { setRunning(false); }
  };

  const doSubmit = async () => {
    setSubmitting(true); setSubmitData(null);
    try {
      const r = await api.post(`/problems/${problemId}/submit/`, { code, language });
      setSubmitData(r.data);
      const mapped = toChips(r.data);
      toast({ status: (mapped.overall === 'AC' || mapped.overall === 'Accepted') ? 'success' : 'error', title: mapped.overall });
    } catch (e: any) {
      console.error(e);
      toast({ status: 'error', title: 'Submission failed', description: e?.response?.data?.detail || String(e) });
    } finally { setSubmitting(false); }
  };

  const askAiReview = async () => {
    if (!code?.trim()) {
      toast({ status: 'warning', title: 'Write some code first' });
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAi(null);

    try {
      const { data } = await api.post(`/problems/${problemId}/review/`, {
        language,
        code,
        stdin: customIn ?? '',
      });

      // normalize to render-safe shape
      const normalized = normalizeAi(data);
      setAi(normalized);
      toast({ status: 'success', title: 'AI review ready' });
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || 'AI review failed';
      setAiError(msg);
      toast({ status: 'error', title: 'AI review failed', description: msg });
    } finally {
      setAiLoading(false);
    }
  };

  /* render states */
  if (loading) {
    return (
      <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center" bg={APP_BG}>
        <Spinner size="xl" />
      </Box>
    );
  }
  if (err) {
    return (
      <Box w="100vw" minH="100vh" bg={APP_BG} p={6}>
        <Alert status="error"><AlertIcon />{err}</Alert>
      </Box>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <Box w="100vw" minH="100vh" bg={APP_BG} color="gray.200">
      {/* top bar */}
      <Box px={6} py={4} display="flex" alignItems="center" justifyContent="space-between">
        <Heading size="lg" color="gray.100">{problem?.title}</Heading>
        <Link as={RouterLink} to="/problems" color="gray.300" _hover={{ color: 'gray.100' }}>
          ⟵ Back to Problems
        </Link>
      </Box>

      {/* split */}
      <Box ref={splitRef} px={6} pb={6}>
        <Box
          display="grid"
          gridTemplateColumns={`${leftPct}% 10px ${100 - leftPct}%`}
          columnGap={0}
          alignItems="stretch"
          minH="calc(100vh - 170px)"
        >
          {/* LEFT: problem card */}
          <Box
            bg={CARD_LIGHT}
            color="gray.900"
            borderRadius="10px"
            p={5}
            boxShadow="sm"
            h="100%"
            overflowY="auto"
          >
            <Wrap mb={3} spacing="8px">
              {problem?.difficulty && (
                <WrapItem>
                  <Tag colorScheme={
                    problem?.difficulty.toLowerCase() === 'easy' ? 'green' :
                    problem?.difficulty.toLowerCase() === 'medium' ? 'yellow' : 'red'
                  }>
                    {problem?.difficulty}
                  </Tag>
                </WrapItem>
              )}
              {(Array.isArray(problem?.tags) ? problem?.tags : []).map((t) => (
                <WrapItem key={t}><Tag variant="subtle">{t}</Tag></WrapItem>
              ))}
            </Wrap>

            <Heading size="md" mb={3} color="gray.900">Problem Statement</Heading>
            <Text whiteSpace="pre-wrap" color="gray.800">{problem?.description}</Text>
          </Box>

          {/* HANDLE */}
          <Box
            role="separator"
            aria-orientation="vertical"
            cursor="col-resize"
            onMouseDown={() => setDragging(true)}
            onTouchStart={() => setDragging(true)}
            display="flex"
            alignItems="stretch"
            justifyContent="center"
            _hover={{ bg: 'whiteAlpha.200' }}
            mx={2}
          >
            <Box w="2px" bg="whiteAlpha.400" my={2} borderRadius="full" />
          </Box>

          {/* RIGHT: editor & tabs */}
          <Box bg={CARD_DARK} borderRadius="10px" p={4} border="1px solid" borderColor="whiteAlpha.200">
            {/* toolbar */}
            <HStack spacing={3} mb={3} justify="space-between">
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                maxW="200px"
                bg="#1a2130"
                borderColor="whiteAlpha.300"
                color="whiteAlpha.900"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </Select>

              <HStack spacing={3}>
                <Button onClick={doRun} isLoading={running} leftIcon={<span>▶</span>}>
                  Run
                </Button>
                <Button colorScheme="teal" onClick={doSubmit} isLoading={submitting} leftIcon={<span>✈</span>}>
                  Submit
                </Button>
                <Button
                  onClick={askAiReview}
                  isLoading={aiLoading}
                  loadingText="Reviewing…"
                  bg="white"
                  color="gray.800"
                  _hover={{ bg: 'whiteAlpha.900' }}
                  border="1px solid"
                  borderColor="blackAlpha.200"
                >
                  Get AI Review
                </Button>
              </HStack>
            </HStack>

            {/* editor */}
            <Box border="1px" borderColor="whiteAlpha.200" borderRadius="8px" overflow="hidden">
              <Editor
                height={EDITOR_H}
                language={language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={(v) => onChangeCode(v || '')}
                theme="vs-dark"
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            </Box>

            {/* tabs */}
            <Tabs variant="enclosed" mt={4} colorScheme="gray">
              <TabList bg="#0f1420" border="1px solid" borderColor="whiteAlpha.200" borderRadius="8px 8px 0 0">
                <Tab>Custom Input</Tab>
                <Tab>Verdict</Tab>
                <Tab>AI Review</Tab>
              </TabList>

              <TabPanels border="1px solid" borderColor="whiteAlpha.200" borderTop="0" borderRadius="0 0 8px 8px" bg="#0f1420">
                {/* Custom Input */}
                <TabPanel>
                  <Text mb={2} fontWeight="semibold">Input (stdin)</Text>
                  <Box
                    as="textarea"
                    value={customIn}
                    onChange={(e: any) => setCustomIn(e.target.value)}
                    p={3}
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    borderRadius="8px"
                    bg="#0e1116"
                    color="whiteAlpha.900"
                    w="100%"
                    minH="120px"
                  />
                  <Text mt={4} mb={2} fontWeight="semibold">Your Output (stdout)</Text>
                  <Box as="pre" p={3} border="1px solid" borderColor="whiteAlpha.300" borderRadius="8px" bg="#0e1116" color="whiteAlpha.900" minH="84px">
                    {runStdout || 'Run code to see output...'}
                  </Box>
                </TabPanel>

                {/* Verdict */}
                <TabPanel>
                  {!submitData ? (
                    <Text color="whiteAlpha.700">Submit to see verdict.</Text>
                  ) : (
                    <>
                      {(() => {
                        const mapped = toChips(submitData);
                        return (
                          <>
                            <Box
                              p={2}
                              borderRadius="md"
                              fontWeight="bold"
                              color={(mapped.overall === 'AC' || mapped.overall === 'Accepted') ? 'green.300' : 'red.300'}
                              bg={(mapped.overall === 'AC' || mapped.overall === 'Accepted') ? '#0f2f19' : '#2f1212'}
                              border="1px solid"
                              borderColor={(mapped.overall === 'AC' || mapped.overall === 'Accepted') ? '#234b32' : '#4b2323'}
                              mb={3}
                            >
                              Result: {mapped.overall}
                            </Box>
                            <Wrap spacing="8px">
                              {mapped.chips.map(c => (
                                <WrapItem key={c.key}>
                                  <Tag colorScheme={c.ok ? 'green' : 'red'}>{c.label}: {c.ok ? 'AC' : 'Fail'}</Tag>
                                </WrapItem>
                              ))}
                            </Wrap>
                          </>
                        );
                      })()}
                    </>
                  )}
                </TabPanel>

                {/* AI Review */}
                <TabPanel>
                  <Box
                    bg="white"
                    color="gray.900"
                    p={4}
                    borderRadius="8px"
                    border="1px solid"
                    borderColor="blackAlpha.200"
                  >
                    <Text mb={3}>
                      Ask an AI to review your code for correctness, edge cases, complexity, and style.
                    </Text>

                    <HStack spacing={3} mb={4}>
                      <Button
                        onClick={askAiReview}
                        isLoading={aiLoading}
                        loadingText="Reviewing…"
                        bg="white"
                        color="gray.800"
                        _hover={{ bg: 'whiteAlpha.900' }}
                        border="1px solid"
                        borderColor="blackAlpha.200"
                      >
                        Get AI Review
                      </Button>
                      {aiError && (
                        <Box color="red.600" fontSize="sm">
                          {aiError}
                        </Box>
                      )}
                    </HStack>

                    {!ai && !aiError && !aiLoading && (
                      <Text color="gray.600">No review yet. Click “Get AI Review”.</Text>
                    )}

                    {ai && (
                      <Box>
                        <Box
                          p={2}
                          mb={3}
                          fontWeight="bold"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="blackAlpha.200"
                          bg={ai.verdict === 'correct' ? '#e9f7ef' :
                              ai.verdict === 'wrong-answer' ? '#fdecea' :
                              ai.verdict === 'runtime-error' ? '#fff4e5' : '#eef2ff'}
                        >
                          Verdict: {ai.verdict}
                        </Box>

                        {ai.explanation && (
                          <>
                            <Heading size="sm" mb={2}>Explanation</Heading>
                            <Text whiteSpace="pre-wrap" mb={3}>{ai.explanation}</Text>
                          </>
                        )}

                        {ai.complexity && (
                          <>
                            <Heading size="sm" mb={2}>Estimated complexity</Heading>
                            <Text mb={3}>{ai.complexity}</Text>
                          </>
                        )}

                        {Array.isArray(ai.issues) && ai.issues.length > 0 && (
                          <>
                            <Heading size="sm" mb={2}>Issues</Heading>
                            <Box as="ul" pl={5} mb={3}>
                              {ai.issues.map((it, i) => <li key={i}>{it}</li>)}
                            </Box>
                          </>
                        )}

                        {Array.isArray(ai.suggestions) && ai.suggestions.length > 0 && (
                          <>
                            <Heading size="sm" mb={2}>Suggestions</Heading>
                            <Box as="ul" pl={5}>
                              {ai.suggestions.map((it, i) => <li key={i}>{it}</li>)}
                            </Box>
                          </>
                        )}

                        {ai.run && (ai.run.stdout || ai.run.stderr) && (
                          <>
                            <Heading size="sm" mt={4} mb={2}>One test run (context)</Heading>
                            {ai.run.stdout && (
                              <>
                                <Text fontWeight="semibold">stdout</Text>
                                <Box as="pre" p={2} bg="#f7fafc" borderRadius="md" border="1px solid #e2e8f0" mb={2}>
                                  {ai.run.stdout}
                                </Box>
                              </>
                            )}
                            {ai.run.stderr && (
                              <>
                                <Text fontWeight="semibold">stderr</Text>
                                <Box as="pre" p={2} bg="#fff5f5" borderRadius="md" border="1px solid #fed7d7">
                                  {ai.run.stderr}
                                </Box>
                              </>
                            )}
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                </TabPanel>

              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
