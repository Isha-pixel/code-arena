// src/components/CodeEditor.tsx
import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  language: string;
  theme: string;
  initialCode: string;
  onCodeChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, theme, initialCode, onCodeChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // This function can be called from a parent component via a ref
  const getEditorValue = () => {
    return editorRef.current?.getValue();
  };

  return (
    <Editor
      height="70vh"
      language={language}
      theme={theme}
      defaultValue={initialCode}
      onMount={handleEditorDidMount}
      onChange={onCodeChange}
      options={{
        selectOnLineNumbers: true,
        minimap: { enabled: false },
      }}
    />
  );
};

export default CodeEditor;