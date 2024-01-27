// https://redirect.cs.umbc.edu/courses/undergraduate/411/spring96/dlx.html

import { jumpOperationsOpCodes } from './definitions/operationsDefinitions.ts'

export interface DecodedRTypeInstruction {
  instructionType: 'R'
  opCode: number
  rs1: number
  rs2: number
  rd: number
}
export interface DecodedJTypeInstruction {
  instructionType: 'J'
  value: number
  opCode: number
}
export interface DecodedITypeInstruction {
  instructionType: 'I'
  opCode: number
  rs1: number
  rd: number
  immediate: number
}

export type DecodedInstruction = DecodedRTypeInstruction | DecodedJTypeInstruction | DecodedITypeInstruction

/* utils */

const extractFromInstruction = (instruction: number, offset: number, numOfBits: number): number => {
  return (instruction >> offset) & ((1 << numOfBits) - 1)
}

/* instruction type detection */
const isRTypeInstruction = (instruction: number): boolean => {
  const mostSignificantBitsOpCode = extractFromInstruction(instruction, 26, 6)
  return mostSignificantBitsOpCode === 0
}

const isJTypeInstruction = (instruction: number): boolean => {
  const mostSignificantBitsOpCode = extractFromInstruction(instruction, 26, 6)
  return jumpOperationsOpCodes.includes(mostSignificantBitsOpCode)
}

/* instruction decoding */
export const decodeRTypeInstruction = (instruction: number): DecodedRTypeInstruction => {
  const opCode = extractFromInstruction(instruction, 0, 6)
  const rd = extractFromInstruction(instruction, 11, 5)
  const rs2 = extractFromInstruction(instruction, 16, 5)
  const rs1 = extractFromInstruction(instruction, 21, 5)
  return {
    instructionType: 'R',
    opCode,
    rs1,
    rs2,
    rd,
  }
}

export const decodeJTypeInstruction = (instruction: number): DecodedJTypeInstruction => {
  const value = extractFromInstruction(instruction, 0, 25)
  const opCode = extractFromInstruction(instruction, 26, 6)
  return {
    instructionType: 'J',
    value,
    opCode,
  }
}

export const decodeITypeInstruction = (instruction: number): DecodedITypeInstruction => {
  const immediate = extractFromInstruction(instruction, 0, 15)
  const rd = extractFromInstruction(instruction, 16, 4)
  const rs1 = extractFromInstruction(instruction, 21, 4)
  const opCode = extractFromInstruction(instruction, 26, 6)
  return {
    instructionType: 'I',
    opCode,
    rs1,
    rd,
    immediate,
  }
}

export const decodeInstruction = (instruction: number): DecodedInstruction => {
  if (isRTypeInstruction(instruction)) {
    return decodeRTypeInstruction(instruction)
  }
  if (isJTypeInstruction(instruction)) {
    return decodeJTypeInstruction(instruction)
  }
  return decodeITypeInstruction(instruction)
}
