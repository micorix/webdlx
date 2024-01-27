import { Program } from '../parser/ast/Program.ts'
import Op from '../parser/ast/Op.ts'
import { operations } from '../dlx/definitions/operationsDefinitions.ts'

function dec2bin(dec) {
  return (dec >>> 0).toString(2)
}

class Assembler {
  program: Program

  constructor(program: Program) {
    this.program = program
  }

  assembleOp(op: Op) {
    const opCode = operations.find((operation) => operation.name === op.mnemonic).opCode

    const imm = op.immediate | op.offset

    const serialized = [
      dec2bin(opCode).padStart(6, '0'),
      dec2bin(parseInt(op.r1.slice(1))).padStart(5, '0'),
      dec2bin(parseInt(op.rd.slice(1))).padStart(5, '0'),
      dec2bin(imm).padStart(16, '0'),
    ].join('')

    const num = parseInt(serialized, 2)
    return num
  }

  assembleInstructions() {
    return this.program.statements.filter((statement) => statement.kind === 'OP').map((op: Op) => this.assembleOp(op))
  }
}

export default Assembler
