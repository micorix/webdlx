export interface ProcessorEvents {
  PIPELINE_EVENT: (event: PipelineEvent) => void
}

export const PROCESSOR_EVENT_TYPES = {
  PIPELINE_EVENT: 'PIPELINE_EVENT',
} as const

export const PROCESSOR_EVENT_SUB_TYPES = {
  INSTRUCTION_FETCH: 'INSTRUCTION_FETCH',
  INSTRUCTION_DECODE: 'INSTRUCTION_DECODE',
  EXECUTE: 'EXECUTE',
  MEMORY_ACCESS: 'MEMORY_ACCESS',
  WRITE_BACK: 'WRITE_BACK',
  END_PIPELINE_STAGE: 'END_PIPELINE_STAGE',
  END_CLOCK_CYCLE: 'END_CLOCK_CYCLE',
} as const

export interface EndPipelineStageEvent {
  type: typeof PROCESSOR_EVENT_TYPES.PIPELINE_EVENT
  subType: typeof PROCESSOR_EVENT_SUB_TYPES.END_PIPELINE_STAGE
  stageName: string
  pcValue: number
  irValue: number
  isStalled: boolean
}

interface EndClockCycleEvent {
  type: typeof PROCESSOR_EVENT_TYPES.PIPELINE_EVENT
  subType: typeof PROCESSOR_EVENT_SUB_TYPES.END_CLOCK_CYCLE
  numberOfInstructionsInPipeline: number
}

export type PipelineEvent = EndPipelineStageEvent | EndClockCycleEvent
