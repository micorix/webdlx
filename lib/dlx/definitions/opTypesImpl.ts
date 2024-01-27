import { OP_TYPES, OperationI, OpType } from './operationsDefinitions.ts'
import Registers, { SingleIntRegister } from '../registers.ts'
import type { DecodedInstruction, DecodedITypeInstruction } from '../instructionDecoding.ts'
import { RequiredResource } from '../requiredResource.ts'

// PREID stage
export interface DetectStallStageArgs {
  decodedInstruction: DecodedInstruction
  pc: SingleIntRegister
}

export interface DetectStallStageResult {
  requiredResources: RequiredResource[]
}

// ID stage
export interface IDStageArgs {
  decodedInstruction: DecodedInstruction
  operation: OperationI
  registers: Registers
}

export interface IDStageResult {
  a: number
  b: number | null
  imm: number
  opType: OpType
  rd: number
}

export type IDStageImpl = (args: IDStageArgs) => IDStageResult

// MEM stage

export interface MEMStageArgs {
  aluOutput: number
  registers: Registers
  rd: number
}

export interface MEMStageResult {
  value: number | null
  address: number
}

export type MEMStageImpl = (args: MEMStageArgs) => MEMStageResult

// WB stage

export interface WBStageArgs {
  aluOutput: number
  rd: number
  lmd: number
}

export interface WBStageResult {
  value: number
  intRegister: number
}

export type WBStageImpl = (args: WBStageArgs) => WBStageResult

// OpTypeImpl

export interface OpTypeImpl {
  DETECT_STALL: (args: DetectStallStageArgs) => DetectStallStageResult
  ID: IDStageImpl
  MEM: MEMStageImpl | null
  WB: WBStageImpl | null
}

const opTypesImplementations: Record<string, OpTypeImpl> = {
  [OP_TYPES.REG2IMM]: {
    DETECT_STALL: ({ decodedInstruction, pc }) => {
      const instruction = decodedInstruction as DecodedITypeInstruction
      return {
        requiredResources: [
          RequiredResource.requireIntRegisterR(instruction.rs1, pc.getValue()),
          RequiredResource.requireIntRegisterW(instruction.rd, pc.getValue()),
        ],
      }
    },
    ID: ({ decodedInstruction, operation, registers }) => {
      const instruction = decodedInstruction as DecodedITypeInstruction
      return {
        a: registers.intRegisters[instruction.rs1],
        b: null,
        imm: instruction.immediate,
        opType: operation.opType,
        rd: instruction.rd,
      }
    },
    MEM: null,
    WB: ({ aluOutput, rd }) => {
      return {
        value: aluOutput,
        intRegister: rd,
      }
    },
  },
  [OP_TYPES.STRI]: {
    DETECT_STALL: ({ decodedInstruction, pc }) => {
      const instruction = decodedInstruction as DecodedITypeInstruction
      return {
        requiredResources: [
          RequiredResource.requireIntRegisterR(instruction.rs1, pc.getValue()),
          RequiredResource.requireIntRegisterR(instruction.rd, pc.getValue()),
          RequiredResource.requireMemoryW(pc.getValue()),
        ],
      }
    },
    ID: ({ decodedInstruction, operation, registers, pc }) => {
      const instruction = decodedInstruction as DecodedITypeInstruction
      return {
        a: registers.intRegisters[instruction.rd],
        b: 0,
        imm: instruction.immediate,
        opType: operation.opType,
        rd: instruction.rs1,
      }
    },
    MEM: ({ aluOutput, registers, rd }) => {
      return {
        value: registers.intRegisters[rd],
        address: aluOutput,
      }
    },
    WB: null,
  },
  [OP_TYPES.LOADI]: {
    DETECT_STALL: ({ decodedInstruction, pc }) => {
      const instruction = decodedInstruction as DecodedITypeInstruction
      return {
        requiredResources: [
          RequiredResource.requireIntRegisterR(instruction.rs1, pc.getValue()),
          RequiredResource.requireMemoryR(pc.getValue()),
        ],
      }
    },
    ID: ({ decodedInstruction, operation, registers }) => {
      const instruction = decodedInstruction as DecodedITypeInstruction
      return {
        a: registers.intRegisters[instruction.rs1],
        b: null,
        imm: instruction.immediate,
        opType: operation.opType,
        rd: instruction.rd,
      }
    },
    MEM: ({ aluOutput }) => {
      return {
        value: null,
        address: aluOutput,
      }
    },
    WB: ({ lmd, rd }) => {
      return {
        value: lmd,
        intRegister: rd,
      }
    },
  },
}

export default opTypesImplementations
