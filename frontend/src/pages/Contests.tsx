import { useEffect, useState } from 'react';
import api from '../services/apiClient';
import { Box, Heading, SimpleGrid, Text, Button, Link } from '@chakra-ui/react';
import dayjs from 'dayjs';

type C = { id:number; name:string; start_unix:number; duration_seconds:number; visit_url:string };

export default function Contests() {
  const [items,setItems]=useState<C[]>([]);
  useEffect(()=>{ (async()=>{
    const r=await api.get('/contests/codeforces/');
    setItems(r.data.upcoming || []);
  })(); },[]);
  return (
    <Box p={8} color="white">
      <Heading size="lg" mb={4}>Upcoming Codeforces Contests</Heading>
      <SimpleGrid columns={[1,2,3]} spacing={4}>
        {items.map(c=>(
          <Box key={c.id} p={4} border="1px" borderColor="whiteAlpha.300" borderRadius="md" bg="#121826">
            <Heading size="md" mb={2}>{c.name}</Heading>
            <Text>Starts: {dayjs(c.start_unix*1000).format('ddd, MMM D HH:mm')}</Text>
            <Text>Duration: {(c.duration_seconds/3600).toFixed(2)} hrs</Text>
            <Button as={Link} href={c.visit_url} isExternal mt={3} colorScheme="teal">Visit</Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
