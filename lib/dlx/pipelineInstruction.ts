import { decodeInstruction } from './instructionDecoding.ts'
import { findOperationByOpCode } from './operations.ts'
import { getStageImplementation } from './operationTypes.ts'
import Registers, { SingleIntRegister } from './registers.ts'
import Memory from './memory.ts'
import { ProcessorEvents } from './eventTypes.ts'
import { ResourceLockManager } from './resourceLock.ts'
import chalk from 'chalk'
import { Emitter } from 'nanoevents'

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
  memory: Memory
}
interface InstructionDecodeStageArgs {
  ir: SingleIntRegister
  pc: SingleIntRegister
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

export const EMPTY_INSTRUCTION_SYMBOL = Symbol('EMPTY_INSTRUCTION_SYMBOL')

export const PIPELINE_STAGES = {
  NOT_STARTED: 'NOT_STARTED',
  IF: 'IF',
  ID: 'ID',
  EX: 'EX',
  MEM: 'MEM',
  WB: 'WB',
  FINISHED: 'FINISHED',
} as const

class PipelineInstruction {
  static readonly STAGES = {
    NOT_STARTED: 'NOT_STARTED',
    IF: 'IF',
    ID: 'ID',
    EX: 'EX',
    MEM: 'MEM',
    WB: 'WB',
  } as const

  private readonly _eventEmitter: Emitter<ProcessorEvents> | null = null

  public requiredResources: [] = []

  private _pc = new SingleIntRegister()
  private _npc = new SingleIntRegister()
  private _ir = new SingleIntRegister()
  private _a = new SingleIntRegister()
  private _b = new SingleIntRegister()
  private _imm = new SingleIntRegister()
  private _rd = new SingleIntRegister()
  private _opType = new OpTypeMockRegister()
  private _opCode = new SingleIntRegister()
  private _aluOutput = new SingleIntRegister()
  private _lmd = new SingleIntRegister()

  private readonly _registers: Registers | null = null
  private readonly _memory: Memory | null = null

  private readonly _process = this._generator()

  private _isEmpty = false
  private _isFinished = false
  private _isStalled = false

  private _currentStage: (typeof PipelineInstruction.STAGES)[keyof typeof PipelineInstruction.STAGES] =
    PipelineInstruction.STAGES.NOT_STARTED

  constructor(
    pcValue: number,
    {
      registers,
      memory,
      eventEmitter,
    }: { registers: Registers; memory: Memory; eventEmitter: Emitter<ProcessorEvents> }
  ) {
    this._registers = registers
    this._memory = memory
    this._eventEmitter = eventEmitter
    this._pc.setValue(pcValue)
  }

  get currentStage() {
    return this._currentStage
  }

  get isStalled() {
    return this._isStalled
  }

  get irValue() {
    return this._ir.getValue()
  }

  get pcValue() {
    return this._pc.getValue()
  }

  instructionFetchStage({ pc, npc, ir, memory }: InstructionFetchStageArgs) {
    /*
        Relies on: pc
        Modifies: ir, npc
         */
    const instructionByteSize = 4

    const _ir = memory.read(pc.getValue())
    if (_ir === 0) {
      this._isEmpty = true
      this._isFinished = true
      return
    }

    ir.setValue(_ir)
    npc.setValue(pc.getValue() + instructionByteSize)

    this._emit('instructionFetched', _ir)
  }

  instructionDecodeStage({ pc, ir, registers, a, b, imm, rd, opType, opCode }: InstructionDecodeStageArgs) {
    /*
         Relies on: ir, registers
         Modifies: a, b, imm, rd
        */
    console.log('IDstage')
    const decodedInstruction = decodeInstruction(ir.getValue())

    this._emit('instructionDecoded', decodedInstruction)
    console.log(chalk.blue('Decoded instruction:'), decodedInstruction)

    const operation = findOperationByOpCode(decodedInstruction.opCode)
    opType.setValue(operation.opType)
    opCode.setValue(operation.opCode)

    const idStageImplementation = getStageImplementation(operation.opType, 'ID')
    const result = idStageImplementation({
      decodedInstruction,
      operation,
      registers,
      pc,
    })
    a.setValue(result.a)
    b.setValue(result.b)
    imm.setValue(result.imm)
    rd.setValue(result.rd)

    const detectStallImplementation = getStageImplementation(operation.opType, 'DETECT_STALL')
    const stallResult = detectStallImplementation({
      decodedInstruction,
      pc,
    })
    this.requiredResources = stallResult.requiredResources
  }

  executeStage({ opCode, a, b, imm, pc, aluOutput }: ExecuteStageArgs) {
    /*
            Relies on: a, b, imm, pc
            Modifies: aluOutput
         */
    const { func: execute } = findOperationByOpCode(opCode.getValue())

    const result = execute({
      a: a.getValue(),
      b: b.getValue(),
      imm: imm.getValue(),
      pc: pc.getValue(),
    })
    aluOutput.setValue(result)
  }

  memoryAccessStage({ opType, aluOutput, registers, rd, lmd, memory }: MemoryAccessStageArgs) {
    /*
            Relies on: aluOutput, registers, rd
            Modifies: lmd, memory
         */

    const memStageImplementation = getStageImplementation(opType.getValue(), 'MEM')
    if (!memStageImplementation) return

    const memStageResult = memStageImplementation({
      aluOutput: aluOutput.getValue(),
      registers,
      rd: rd.getValue(),
      lmd: lmd.getValue(),
      memory,
    })
    if (memStageResult.value) {
      memory.write(memStageResult.address, memStageResult.value)
    } else {
      lmd.setValue(memory.read(memStageResult.address))
    }
  }

  writeBackStage({ opType, aluOutput, rd, lmd, registers }: WriteBackStageArgs) {
    /*
            Relies on: aluOutput, rd, lmd
            Modifies: registers
         */
    const writeBackStageImplementation = getStageImplementation(opType.getValue(), 'WB')
    if (!writeBackStageImplementation) return

    const wbStageResult = writeBackStageImplementation({
      aluOutput: aluOutput.getValue(),
      rd: rd.getValue(),
      lmd: lmd.getValue(),
    })
    if (wbStageResult.value) {
      registers.intRegisters[wbStageResult.intRegister] = wbStageResult.value
    }
  }

  next() {
    return this._process.next()
  }

  stall() {
    this._isStalled = true
  }

  unstall() {
    this._isStalled = false
  }

  private *_generator() {
    this.instructionFetchStage({
      pc: this._pc,
      npc: this._npc,
      ir: this._ir,
      memory: this._memory!,
    })
    this._currentStage = PipelineInstruction.STAGES.IF

    if (this._isEmpty) return

    yield

    this.instructionDecodeStage({
      ir: this._ir,
      registers: this._registers!,
      opType: this._opType,
      opCode: this._opCode,
      a: this._a,
      b: this._b,
      imm: this._imm,
      rd: this._rd,
      pc: this._pc,
    })

    this._currentStage = PipelineInstruction.STAGES.ID

    yield

    while (this._isStalled) {
      this.instructionDecodeStage({
        ir: this._ir,
        registers: this._registers!,
        opType: this._opType,
        opCode: this._opCode,
        a: this._a,
        b: this._b,
        imm: this._imm,
        rd: this._rd,
        pc: this._pc,
      })
      yield
    }

    this.executeStage({
      a: this._a,
      b: this._b,
      imm: this._imm,
      pc: this._pc,
      aluOutput: this._aluOutput,
      opCode: this._opCode,
    })
    this._currentStage = PipelineInstruction.STAGES.EX
    yield

    this.memoryAccessStage({
      opType: this._opType,
      aluOutput: this._aluOutput,
      registers: this._registers!,
      rd: this._rd,
      lmd: this._lmd,
      memory: this._memory!,
    })
    this._currentStage = PipelineInstruction.STAGES.MEM
    yield

    this.writeBackStage({
      opType: this._opType,
      aluOutput: this._aluOutput,
      rd: this._rd,
      lmd: this._lmd,
      registers: this._registers!,
    })
    this._currentStage = PipelineInstruction.STAGES.WB

    this._isFinished = true
  }

  isEmpty() {
    return this._isEmpty
  }

  isFinished() {
    return this._isFinished
  }

  private _emit(eventName: string, ...args: any[]) {
    if (!this._eventEmitter) return
    this._eventEmitter.emit(eventName, ...args)
  }
}

export default PipelineInstruction
