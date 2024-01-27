import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react'
import { useEffect, useRef } from 'react'
import configureMonaco, { DLX_ASM_LANG } from '../../monacoConfig/configure.ts'
import { useCodeContext } from '../../contexts/codeContext.tsx'

const editorDefaultValue = `; Write your code here`

const editorOptions = {
  fontFamily: 'Fira Code',
  fontLigatures: true,
  fontSize: 16,
  fontWeight: 600,
}

const AssemblyEditor = () => {
  const editorRef = useRef<MonacoEditor>()
  const monacoRef = useRef<Monaco>()
  const codeContext = useCodeContext()
  const handleMonacoEditorMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    configureMonaco(monaco)
  }
  const handleChange = (value, event) => {
    console.log(value)
    codeContext.setCode(value)
  }
  return (
    <MonacoEditor
      options={editorOptions}
      defaultLanguage={DLX_ASM_LANG}
      onMount={handleMonacoEditorMount}
      onChange={handleChange}
      defaultValue={codeContext.code || editorDefaultValue}
    />
  )
}

export default AssemblyEditor
