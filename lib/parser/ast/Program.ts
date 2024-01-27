import { BaseStatement, Node, PROGRAM_KIND } from './base'

export class Program implements Node {
  statements: BaseStatement[] = []
  data: BaseStatement[] = []
  kind = PROGRAM_KIND.PROGRAM

  public toString(): string {
    return `Program: ${this.statements.map((s) => s.toString()).join('\n')}`
  }
}
