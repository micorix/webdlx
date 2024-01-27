import { createContext, useContext, useState } from 'react'
import { PipelineEvent } from '../../lib/dlx/eventTypes.ts'
import Registers from '../../lib/dlx/registers.ts'
import Memory from '../../lib/dlx/memory.ts'
import { useCodeContext } from './codeContext.tsx'
import ProcessorWorker from '../worker/processor.worker.ts?worker'

export interface ProcessorContextType {
  registers: Registers
  memory: Memory
  events: PipelineEvent[]
  runCode: () => Promise<void>
}

const processorContext = createContext<ProcessorContextType>({
  registers: new Registers(),
  memory: new Memory(),
  events: [],
  runCode: async () => {},
})

export const useProcessorContext = () => useContext(processorContext)

export const ProcessorContextProvider = ({ children }) => {
  const [registers, setRegisters] = useState<Registers>(new Registers())
  const [memory, setMemory] = useState<Memory>(new Memory())
  const [events, setPipelineEvents] = useState<PipelineEvent[]>([])
  const { code } = useCodeContext()

  const runCode = () =>
    new Promise((resolve, reject) => {
      const worker: Worker = new ProcessorWorker()
      worker.onmessage = (e) => {
        const { type, payload } = e.data
        if (type === 'runAllFinished') {
          setRegisters(new Registers(payload.registers))
          setMemory(new Memory(payload.memory))
          setPipelineEvents(payload.events)
          resolve()
        }
      }

      worker.postMessage({
        type: 'init',
        payload: {
          code,
        },
      })
      worker.postMessage({
        type: 'runAll',
      })

      setTimeout(() => {
        worker.terminate()
        reject()
      }, 10000)
    })

  return (
    <processorContext.Provider
      value={{
        registers,
        memory,
        events,
        runCode,
      }}
    >
      {children}
    </processorContext.Provider>
  )
}
