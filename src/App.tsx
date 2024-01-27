import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Router from './Router.tsx'
import { CodeContextProvider } from './contexts/codeContext.tsx'
import { ProcessorContextProvider } from './contexts/processorContext.tsx'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)

  return (
    <CodeContextProvider>
      <ProcessorContextProvider>
        <Toaster />
        <Router />
      </ProcessorContextProvider>
    </CodeContextProvider>
  )
}

export default App
