import DLXProcessor from '../../lib/dlx/processor.ts'
import { Lexer } from '../../lib/parser/lexer.ts'
import { Parser } from '../../lib/parser/parser.ts'
import Assembler from '../../lib/assembler/assembler.ts'
import { PROCESSOR_EVENT_TYPES } from '../../lib/dlx/eventTypes.ts'

let processor: DLXProcessor
const events = []

self.onmessage = (event: MessageEvent) => {
  const { data } = event
  const { type, payload } = data
  switch (type) {
    case 'init': {
      const { code } = payload
      const lexer = new Lexer(code)
      const parser = new Parser(lexer)
      const parsedProgram = parser.parseProgram()
      const compiler = new Assembler(parsedProgram)
      const assembledInstructions = compiler.assembleInstructions()
      processor = new DLXProcessor()
      processor.memory.writeProgram(assembledInstructions)

      processor.on(PROCESSOR_EVENT_TYPES.PIPELINE_EVENT, (event) => {
        events.push(event)
      })
      break
    }
    case 'runAll': {
      console.log(processor.memory.serialize())
      processor.runAll()
      self.postMessage({
        type: 'runAllFinished',
        payload: {
          events,
          registers: processor.registers,
          memory: processor.memory,
        },
      })
      break
    }
  }
}
