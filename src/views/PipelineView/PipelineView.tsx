import { useState } from 'react'
import DLXProcessor from '../../../lib/dlx/processor.ts'
import { Lexer } from '../../../lib/parser/lexer.ts'
import { Parser } from '../../../lib/parser/parser.ts'
import Compiler from '../../../lib/compiler/compiler.ts'
import { useCodeContext } from '../../contexts/codeContext.tsx'
import AppLayout from '../../components/AppLayout.tsx'
import { PROCESSOR_EVENT_TYPES } from '../../../lib/dlx/eventTypes.ts'
import pipelineEventsToBlocks from './lib/pipelineEventsToBlocks.ts'
import Pipeline from './Pipeline.tsx'
import { useProcessorContext } from '../../contexts/processorContext.tsx'

const PipelineView = () => {
  const { events } = useProcessorContext()
  return (
    <AppLayout>
      <div className="p-5">
        <div className="mb-10">
          <h1 className="text-2xl">Pipeline</h1>
        </div>
        <div className="overflow-x-auto">
          <Pipeline instructionsMap={pipelineEventsToBlocks(events)} />
        </div>
      </div>
    </AppLayout>
  )
}

export default PipelineView
