import { BaseOp, STATEMENT_KIND } from './base.ts'
import { Token } from '../token.ts'

class Op implements BaseOp {
  kind = STATEMENT_KIND.OP
  token: Token

  mnemonic: string
  rd: string
  r1: string
  r2: string | null = null
  offset: number | null = null
  immediate: number | null = null

  constructor(token: Token) {
    this.token = token
  }

  public toString(): string {
    return `Op: ${this.mnemonic} ${this.rd}, ${this.r1}, ${this.r2}, imm: ${this.offset}, off: ${this.immediate}`
  }
}

export default Op
