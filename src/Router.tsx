import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EditorView from './views/EditorView/EditorView.tsx'
import PipelineView from './views/PipelineView/PipelineView.tsx'
import LogsView from './views/LogsView/LogsView.tsx'
import RegMemView from './views/RegMemView/RegmemView.tsx'
import TestsView from './views/TestsView/TestsView.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <EditorView />,
  },
  {
    path: '/pipeline',
    element: <PipelineView />,
  },
  {
    path: '/logs',
    element: <LogsView />,
  },
  {
    path: '/regmem',
    element: <RegMemView />,
  },
  {
    path: '/tests',
    element: <TestsView />,
  },
])

const Router = () => <RouterProvider router={router} />

export default Router
