import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { Box, Heading, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

type Row={user_id:number;username:string;solved:number;last_submission:string};

export default function Leaderboard(){
  const [rows,setRows]=useState<Row[]>([]);
  useEffect(()=>{ (async()=>{
    const r=await api.get('/leaderboard/');
    setRows(r.data.results||[]);
  })(); },[]);
  return (
    <Box p={8} color="white">
      <Heading size="lg" mb={4}>Leaderboard</Heading>
      <Table variant="simple" colorScheme="gray">
        <Thead><Tr><Th>#</Th><Th>User</Th><Th isNumeric>Solved</Th><Th>Last Submission</Th></Tr></Thead>
        <Tbody>
          {rows.map((r,i)=>(
            <Tr key={r.user_id}>
              <Td>{i+1}</Td><Td>{r.username}</Td>
              <Td isNumeric>{r.solved}</Td>
              <Td>{r.last_submission?.toString()?.replace('T',' ').slice(0,19) || '-'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
