import { EndPipelineStageEvent, PipelineEvent, PROCESSOR_EVENT_SUB_TYPES } from '../../../../lib/dlx/eventTypes.ts'

export interface PipelineInstructionInfo {
  stages: string[]
  offset: number
  irValue: number
}

export type PipelineInstructionsMap = Map<number, PipelineInstructionInfo>

const pipelineEventsToBlocks = (events: PipelineEvent[]): PipelineInstructionsMap => {
  let numberOfClockCycles = 0
  const instructionsMap: PipelineInstructionsMap = new Map()

  events.forEach((event) => {
    if (event.subType === PROCESSOR_EVENT_SUB_TYPES.END_CLOCK_CYCLE) {
      numberOfClockCycles++
      return
    }
    if (event.subType === PROCESSOR_EVENT_SUB_TYPES.END_PIPELINE_STAGE) {
      const { pcValue, stageName, isStalled, irValue } = event

      if (!instructionsMap.has(pcValue)) {
        instructionsMap.set(pcValue, {
          stages: [],
          offset: numberOfClockCycles,
          irValue,
        })
      }
      instructionsMap.get(pcValue).stages.push(isStalled ? `STALL` : stageName)
    }
  })
  return instructionsMap
}

// <div className="w-full flex mb-2">
// <div className="mr-5 pr-5 flex items-center">
// <span className="font-semibold" style={{fontFamily: 'Fira Code'}}>ADDI R4, R0, 2</span>
// </div>
// <IFBlock/>
// <IDBlock/>
// <EXBlock/>
// <MEMBlock/>
// <WBBlock/>
// <StallBlock/>
// </div>

export default pipelineEventsToBlocks
