import TestsEditor from './TestsEditor.tsx'
import AppLayout from '../../components/AppLayout.tsx'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { expect } from 'chai'
import { useProcessorContext } from '../../contexts/processorContext.tsx'
import MyReporter from './mocha/Reporter.tsx'

const TestsView = () => {
  const [testsCode, setTestsCode] = useState(window.localStorage.getItem('testsCode'))
  const mochaRef = useRef<Mocha>()
  const processorContext = useProcessorContext()
  const [testResults, setTestResults] = useState<ReactNode>([])

  const runTests = () =>
    new Promise((resolve) => {
      if (mochaRef.current) {
        setTestResults([])
        mochaRef.current.dispose()
      }
      mochaRef.current = new Mocha({
        ui: 'bdd',
        reporter: MyReporter,
        reporterOptions: {
          setTestResults,
        },
      })
      mochaRef.current.ui('bdd')
      mochaRef.current.checkLeaks()
      mochaRef.current.suite.emit('pre-require', window, null, mochaRef.current)

      new Function(
        'globals',
        `
                const {expect, it, describe, registers, memory} = globals
                ${testsCode}
            `
      )({
        expect,
        it: window.it,
        describe: window.describe,
        registers: processorContext.registers,
        memory: processorContext.memory,
      })
      const runner = mochaRef.current.run((...args) => {
        console.log(args)
        console.log(mochaRef.current)
        console.log(runner)
        console.log(processorContext)
        resolve()
      })
    })

  useEffect(() => {
    ;(async () => {
      await runTests()
    })()
  }, [processorContext.events])

  const handleTestsCodeChange = (value) => {
    window.localStorage.setItem('testsCode', value)
    setTestsCode(value)
  }
  return (
    <AppLayout>
      <div className="grid grid-cols-2 h-full">
        <div className="h-full w-full">
          <TestsEditor value={testsCode} onChange={handleTestsCodeChange} />
        </div>
        <div className="relative">{testResults}</div>
      </div>
    </AppLayout>
  )
}

export default TestsView
