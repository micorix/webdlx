import { Editor as MonacoEditor } from '@monaco-editor/react'
import AssemblyEditor from './AssemblyEditor.tsx'
import AppLayout from '../../components/AppLayout.tsx'
const EditorView = () => {
  return (
    <AppLayout>
      <AssemblyEditor />
    </AppLayout>
  )
}

export default EditorView
