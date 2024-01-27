import { PipelineInstructionsMap } from './lib/pipelineEventsToBlocks.ts'
import { FC } from 'react'

const PipelineBlock = ({ bgClassName, borderClassName, colorClassName, label }) => {
  return (
    <div className={`rounded border-2 ${borderClassName} ${bgClassName}/10 inline-block py-2 w-20 text-center mx-1`}>
      <span className={`font-bold ${colorClassName}`}>{label}</span>
    </div>
  )
}
const IFBlock = () => {
  return (
    <PipelineBlock
      bgClassName="bg-yellow-500"
      borderClassName="border-yellow-500"
      colorClassName="text-yellow-300"
      label="IF"
    />
  )
}
const IDBlock = () => {
  return (
    <PipelineBlock
      bgClassName="bg-orange-500"
      borderClassName="border-orange-500"
      colorClassName="text-orange-300"
      label="ID"
    />
  )
}
const EXBlock = () => {
  return (
    <PipelineBlock bgClassName="bg-red-500" borderClassName="border-red-500" colorClassName="text-red-300" label="EX" />
  )
}
const MEMBlock = () => {
  return (
    <PipelineBlock
      bgClassName="bg-green-500"
      borderClassName="border-green-500"
      colorClassName="text-green-300"
      label="MEM"
    />
  )
}
const WBBlock = () => {
  return (
    <PipelineBlock
      bgClassName="bg-purple-500"
      borderClassName="border-purple-500"
      colorClassName="text-purple-300"
      label="WB"
    />
  )
}
const StallBlock = () => {
  return (
    <PipelineBlock
      bgClassName="bg-gray-500"
      borderClassName="border-gray-500"
      colorClassName="text-gray-300"
      label="STALL"
    />
  )
}

const PIPELINE_BLOCKS = {
  IF: <IFBlock />,
  ID: <IDBlock />,
  EX: <EXBlock />,
  MEM: <MEMBlock />,
  WB: <WBBlock />,
  STALL: <StallBlock />,
}

const PipelineInstruction = ({ irValue, stages, offset }: { stages: string[] }) => {
  return (
    <div className="w-full mb-2 flex">
      <div className="mr-5 pr-5 flex items-center">
        <span className="font-semibold" style={{ fontFamily: 'Fira Code' }}>
          {irValue}
        </span>
      </div>
      <div style={{ marginLeft: `${offset * 5 + 0.5 * offset}rem` }} className="flex">
        {stages.map((stage) => PIPELINE_BLOCKS[stage])}
      </div>
    </div>
  )
}

interface PipelineProps {
  instructionsMap: PipelineInstructionsMap
}

const Pipeline: FC<PipelineProps> = ({ instructionsMap }) => {
  const instructionComponents: FC[] = []
  for (const [irValue, { stages, offset }] of instructionsMap) {
    instructionComponents.push(<PipelineInstruction offset={offset} irValue={irValue} stages={stages} />)
  }
  return instructionComponents
}

export default Pipeline
