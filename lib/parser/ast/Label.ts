import { BaseStatement, STATEMENT_KIND } from './base.ts'
import { Token } from '../token.ts'

class Label implements BaseStatement {
  kind = STATEMENT_KIND.LABEL
  token: Token

  name: string

  constructor(token: Token) {
    this.token = token
  }

  public toString(): string {
    return `Label: ${this.name}`
  }
}

export default Label
