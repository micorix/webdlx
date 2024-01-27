import { Editor as MonacoEditor, Monaco } from '@monaco-editor/react'
import { useRef } from 'react'
import configureMonaco from '../../monacoConfig/configure.ts'

const editorDefaultValue = `// Write your tests here`

const editorOptions = {
  fontFamily: 'Fira Code',
  fontLigatures: true,
  fontSize: 16,
  fontWeight: 600,
}

const TestsEditor = ({ onChange, value }) => {
  const editorRef = useRef<MonacoEditor>()
  const monacoRef = useRef<Monaco>()

  const handleMonacoEditorMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    configureMonaco(monaco)
  }
  const handleChange = (value, event) => {
    console.log(value)
  }
  return (
    <MonacoEditor
      options={editorOptions}
      defaultLanguage="javascript"
      onChange={onChange}
      value={value}
      onMount={handleMonacoEditorMount}
      defaultValue={editorDefaultValue}
    />
  )
}

export default TestsEditor
