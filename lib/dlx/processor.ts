import Registers, { SingleIntRegister } from './registers'
import Memory from './memory'
import { PROCESSOR_EVENT_SUB_TYPES, PROCESSOR_EVENT_TYPES, ProcessorEvents } from './eventTypes.ts'
import PipelineInstruction from './pipelineInstruction.ts'
import { ResourceLockManager } from './resourceLock.ts'
import { createNanoEvents } from 'nanoevents'
import { GlobalResourceManager } from './requiredResource.ts'
import chalk from 'chalk'

class OpTypeMockRegister {
  private _value: string | null = null

  getValue() {
    return this._value
  }

  setValue(value: string) {
    this._value = value
  }
}

interface InstructionFetchStageArgs {
  pc: SingleIntRegister
  npc: SingleIntRegister
  ir: SingleIntRegister
}

interface InstructionDecodeStageArgs {
  ir: SingleIntRegister
  registers: Registers

  opType: OpTypeMockRegister
  opCode: SingleIntRegister
  a: SingleIntRegister
  b: SingleIntRegister
  imm: SingleIntRegister
  rd: SingleIntRegister
}

interface ExecuteStageArgs {
  a: SingleIntRegister
  b: SingleIntRegister
  imm: SingleIntRegister
  pc: SingleIntRegister
  aluOutput: SingleIntRegister
  opCode: SingleIntRegister
}

interface MemoryAccessStageArgs {
  opType: OpTypeMockRegister
  aluOutput: SingleIntRegister
  registers: Registers
  rd: SingleIntRegister
  lmd: SingleIntRegister
  memory: Memory
}

interface WriteBackStageArgs {
  opType: OpTypeMockRegister
  aluOutput: SingleIntRegister
  rd: SingleIntRegister
  lmd: SingleIntRegister
  registers: Registers
}

const EMPTY_INSTRUCTION_SYMBOL = Symbol('EMPTY_INSTRUCTION_SYMBOL')

class DLXProcessor {
  private _eventEmitter = createNanoEvents<ProcessorEvents>()

  registers = new Registers()
  memory = new Memory()

  private _pcValue = 0
  private _pipeline: PipelineInstruction[] = []
  private readonly _globalResourceManager = new GlobalResourceManager()

  private _process = this._generator()

  constructor() {}

  *_generator() {
    let shouldStopAddingInstructions = false
    const stalledPcs = new Set<number>()

    this._pipeline.push(
      new PipelineInstruction(this._pcValue, {
        registers: this.registers,
        memory: this.memory,
        eventEmitter: this._eventEmitter,
      })
    )

    while (true) {
      let idxOfFinishedInstructions = []

      for (let i = 0; i < this._pipeline.length; i++) {
        const pipelineInstruction = this._pipeline[i]

        pipelineInstruction.next()

        if (pipelineInstruction.isEmpty()) {
          shouldStopAddingInstructions = true
          idxOfFinishedInstructions.push(i)
          continue
        }
        if (pipelineInstruction.currentStage === PipelineInstruction.STAGES.ID) {
          const areResourcesAvailable = this._globalResourceManager.requestResourcesForInstruction(
            pipelineInstruction.requiredResources
          )

          if (!areResourcesAvailable) {
            stalledPcs.add(pipelineInstruction.pcValue)
            pipelineInstruction.stall()
            this._eventEmitter.emit(PROCESSOR_EVENT_TYPES.PIPELINE_EVENT, {
              type: PROCESSOR_EVENT_TYPES.PIPELINE_EVENT,
              subType: PROCESSOR_EVENT_SUB_TYPES.END_PIPELINE_STAGE,
              stageName: pipelineInstruction.currentStage,
              pcValue: pipelineInstruction.pcValue,
              irValue: pipelineInstruction.irValue,
              isStalled: pipelineInstruction.isStalled,
            })
            break
          } else {
            stalledPcs.delete(pipelineInstruction.pcValue)
            pipelineInstruction.unstall()
          }
        }

        if (pipelineInstruction.currentStage === PipelineInstruction.STAGES.MEM) {
          this._globalResourceManager.releaseMemory(pipelineInstruction.pcValue)
        }

        if (pipelineInstruction.isFinished()) {
          console.log(chalk.red.bold('finished', pipelineInstruction.pcValue))
          this._globalResourceManager.releaseRegisters(pipelineInstruction.pcValue)
          idxOfFinishedInstructions.push(i)
        }

        this._eventEmitter.emit(PROCESSOR_EVENT_TYPES.PIPELINE_EVENT, {
          type: PROCESSOR_EVENT_TYPES.PIPELINE_EVENT,
          subType: PROCESSOR_EVENT_SUB_TYPES.END_PIPELINE_STAGE,
          stageName: pipelineInstruction.currentStage,
          pcValue: pipelineInstruction.pcValue,
          irValue: pipelineInstruction.irValue,
          isStalled: pipelineInstruction.isStalled,
        })
      }
      console.log(
        idxOfFinishedInstructions,
        this._pipeline.map((inst) => ({
          pc: inst.pcValue,
          stage: inst.currentStage,
          isStalled: inst.isStalled,
          opCode: inst.irValue,
        }))
      )
      for (let i = idxOfFinishedInstructions.length - 1; i >= 0; i--)
        this._pipeline.splice(idxOfFinishedInstructions[i], 1)

      idxOfFinishedInstructions = []
      if (this._pipeline.length === 0) {
        break
      }

      this._eventEmitter.emit(PROCESSOR_EVENT_TYPES.PIPELINE_EVENT, {
        type: PROCESSOR_EVENT_TYPES.PIPELINE_EVENT,
        subType: PROCESSOR_EVENT_SUB_TYPES.END_CLOCK_CYCLE,
        numberOfInstructionsInPipeline: this._pipeline.length,
      })
      console.log('stalledPcs', stalledPcs)
      if (!shouldStopAddingInstructions && stalledPcs.size === 0) {
        this._pcValue += 4
        this._pipeline.push(
          new PipelineInstruction(this._pcValue, {
            registers: this.registers,
            memory: this.memory,
            eventEmitter: this._eventEmitter,
          })
        )
        // console.log(this.memory.write(240, 2))
      }
      yield
    }
  }

  next() {
    return this._process.next()
  }

  runAll() {
    let i = 0
    while (true) {
      const result = this.next()
      i++
      if (result.done) break
    }
    console.log('Finished in', i, 'ticks')
  }

  on(event: keyof ProcessorEvents, listener: (...args: any[]) => void) {
    this._eventEmitter.on(event, listener)
  }
}

export default DLXProcessor
