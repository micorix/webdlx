import { mnemonics, operations } from '../dlx/definitions/operationsDefinitions.ts'

export const TOKENS = {
  COMMA: 'COMMA',
  COLON: ':',
  LPAREN: '(',
  RPAREN: ')',
  IDENT: 'IDENT',
  INT: 'INT',
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',

  INT_REGISTER: 'INT_REGISTER',
  OFFSET: 'OFFSET',
  OP: 'OP',
  LABEL: 'LABEL',
  DIRECTIVE: 'DIRECTIVE',
  TRAP: 'TRAP',
  COMMENT: 'COMMENT',
}

export type TokenType = string

export class Token {
  type: TokenType
  literal: string

  constructor(_type: TokenType, literal: string) {
    this.type = _type
    this.literal = literal
  }
}

export function lookupIdent(ident: string) {
  const identUpper = ident.toUpperCase()
  return mnemonics.includes(identUpper) ? TOKENS.OP : TOKENS.IDENT
}
