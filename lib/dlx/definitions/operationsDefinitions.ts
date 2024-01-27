export const OP_TYPES = {
  IMPTODO: 'IMPTODO', // Instruction not implemented yet
  UNIMP: 'UNIMP', // Instruction not implemented in WinDLX
  REG2IMM: 'REG2IMM',
  REGLAB: 'REGLAB',
  LOADI: 'LOADI',
  STRI: 'STRI',
} as const

export type OpType = (typeof OP_TYPES)[keyof typeof OP_TYPES]

export interface OperationI {
  name: string
  opCode: number
  func: (args: { a: number; b: number; imm: number; pc: number }) => number
  opType: OpType
}

const noop = () => 0

export const operations: OperationI[] = [
  {
    name: 'SPECIAL',
    opCode: 0x00,
    func: noop,
    opType: OP_TYPES.UNIMP,
  },
  {
    name: 'FPARITH',
    opCode: 0x01,
    func: noop,
    opType: OP_TYPES.UNIMP,
  },
  {
    name: 'ADDI',
    opCode: 0x02,
    func: ({ a, imm }) => {
      return a + imm
    },
    opType: OP_TYPES.REG2IMM,
  },
  {
    name: 'ADDUI',
    opCode: 0x03,
    func: ({ a, imm }) => a + imm,
    opType: OP_TYPES.REG2IMM,
  },
  {
    name: 'ANDI',
    opCode: 0x04,
    func: ({ a, imm }) => a & imm,
    opType: OP_TYPES.REG2IMM,
  },
  {
    name: 'ANDI',
    opCode: 0x04,
    func: ({ a, imm }) => a & imm,
    opType: OP_TYPES.REG2IMM,
  },
  {
    name: 'BEQZ',
    opCode: 0x05,
    func: ({ a, pc, imm }) => {
      if (a === 0) {
        return pc + imm + 4
      }
      return pc + 4
    },
    opType: OP_TYPES.REGLAB,
  },
  {
    name: 'ANDI',
    opCode: 0x04,
    func: ({ a, imm }) => a & imm,
    opType: OP_TYPES.REG2IMM,
  },
  {
    name: 'BNEZ',
    opCode: 0x08,
    func: ({ a, pc, imm }) => {
      if (a !== 0) {
        return pc + imm + 4
      }
      return pc + 4
    },
    opType: OP_TYPES.REGLAB,
  },
  {
    name: 'LW',
    opCode: 0x14,
    func: ({ a, imm }) => {
      return a + imm
    },
    opType: OP_TYPES.LOADI,
  },
  {
    name: 'SW',
    opCode: 0x2a,
    func: ({ a, b, imm }) => {
      return a + imm
    },
    opType: OP_TYPES.STRI,
  },
]

export const mnemonics = operations.map((op) => op.name)

export const jumpOperationsOpCodes = operations.filter((op) => op.opType === OP_TYPES.REGLAB).map((op) => op.opCode)
