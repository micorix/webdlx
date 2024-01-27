import { BaseStatement, STATEMENT_KIND } from './base.ts'
import { Token } from '../token.ts'

class Data implements BaseStatement {
  kind = STATEMENT_KIND.DATA
  token: Token

  labelName: string
  data: number[] = []
  dataType: string

  constructor(token: Token) {
    this.token = token
  }

  public toString(): string {
    return `Data: ${this.data}`
  }
}

export default Data
