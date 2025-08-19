// src/pages/AddProblem.tsx
import { useMemo, useState } from 'react';
import {
  Box, Heading, FormControl, FormLabel, Input, Textarea,
  Select, Button, HStack, useToast, Tag, TagLabel, TagCloseButton,
  Wrap, WrapItem, VStack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/apiClient';

const MBox = motion(Box);

type Diff = 'Easy' | 'Medium' | 'Hard';

export default function AddProblem() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Diff>('Easy');

  // tag chips
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['arrays', 'two pointers']);

  const [statement, setStatement] = useState('');
  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const nav = useNavigate();

  const canSubmit = useMemo(
    () => title.trim().length > 0 && statement.trim().length > 0,
    [title, statement]
  );

  const addTagFromInput = () => {
    const raw = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    if (!raw.length) return;
    setTags(prev => {
      const next = new Set(prev.map(t => t.toLowerCase()));
      raw.forEach(t => next.add(t.toLowerCase()));
      return Array.from(next);
    });
    setTagInput('');
  };

  const removeTag = (t: string) => {
    setTags(prev => prev.filter(x => x !== t));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast({ status: 'warning', description: 'Title and statement are required.' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        difficulty,
        tags,                // array of strings
        statement: statement // markdown/plain text
      };

      const { data } = await api.post('/problems/', payload);
      toast({ status: 'success', description: 'Problem created.' });
      // If backend returns the created id
      if (data?.id) nav(`/problems/${data.id}`);
      else nav('/problems');
    } catch (e: any) {
      const msg =
        e?.response?.data
          ? JSON.stringify(e.response.data)
          : 'Failed to create problem';
      toast({ status: 'error', description: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box px={[4, 8]} py={8} color="white">
      <Heading size="lg" mb={6}>Create Problem</Heading>

      <MBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .25 }}
        p={6}
        bg="#121826"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="md"
        maxW="960px"
      >
        <VStack spacing={5} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Closest Refuge"
            />
          </FormControl>

          <HStack spacing={6} align="flex-start">
            <FormControl maxW="240px">
              <FormLabel>Difficulty</FormLabel>
              <Select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Diff)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTagFromInput();
                  }
                }}
                placeholder="Type a tag and press Enter (comma separated also works)"
              />
              <Wrap mt={2}>
                {tags.map(t => (
                  <WrapItem key={t}>
                    <Tag size="md" variant="subtle">
                      <TagLabel textTransform="capitalize">{t}</TagLabel>
                      <TagCloseButton onClick={() => removeTag(t)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>Statement (Markdown supported)</FormLabel>
            <Textarea
              value={statement}
              onChange={e => setStatement(e.target.value)}
              rows={10}
              placeholder={`Problem description, input/output format, constraints, examples...`}
            />
          </FormControl>

          <HStack>
            <Button
              colorScheme="teal"
              isLoading={saving}
              isDisabled={!canSubmit}
              onClick={handleSubmit}
            >
              Create
            </Button>
            <Button variant="outline" onClick={() => nav(-1)}>Cancel</Button>
          </HStack>
        </VStack>
      </MBox>
    </Box>
  );
}
