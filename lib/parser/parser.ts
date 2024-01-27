import { Lexer } from './lexer.ts'
import { Token, TOKENS, TokenType } from './token.ts'
import Op from './ast/Op.ts'
import Label from './ast/Label.ts'
import { Program } from './ast/Program.ts'
import Data from './ast/Data.ts'

export class Parser {
  private lexer: Lexer
  private currentToken: Token
  private peekToken: Token

  constructor(lexer: Lexer) {
    this.lexer = lexer
    this.nextToken()
    this.nextToken()
  }

  nextToken() {
    this.currentToken = this.peekToken
    // peekToken is always pointing to the next token
    this.peekToken = this.lexer.nextToken()
  }

  parseProgram() {
    const program = new Program()

    let parsingMode = 'text'

    while (this.currentToken.type !== TOKENS.EOF) {
      if (this.currentTokenIs(TOKENS.DIRECTIVE)) {
        if (this.currentToken.literal === 'text') {
          parsingMode = 'text'
        } else if (this.currentToken.literal === 'data') {
          parsingMode = 'data'
        }
      }
      if (parsingMode === 'data') {
        const statement = this.parseDataStatement()

        if (statement) {
          program.data.push(statement)
        }
      } else {
        const statement = this.parseTextStatement()

        if (statement) {
          program.statements.push(statement)
        }
      }

      this.nextToken()
    }

    return program
  }

  private parseDataStatement() {
    if (!this.currentTokenIs(TOKENS.LABEL)) {
      return null
    }
    const data = new Data(this.currentToken)
    const label = this.parseLabel()
    data.labelName = label.name
    this.nextToken()
    while (true) {
      if (this.currentTokenIs(TOKENS.DIRECTIVE)) {
        data.dataType = this.currentToken.literal
        this.nextToken()
      } else if (this.currentTokenIs(TOKENS.INT)) {
        data.data.push(parseInt(this.currentToken.literal))
        this.nextToken()
      } else if (this.currentTokenIs(TOKENS.COMMA)) {
        this.nextToken()
      } else {
        break
      }
    }
    return data
  }

  /** === Parsing Statements === */
  private parseTextStatement() {
    if (this.currentTokenIs(TOKENS.OP)) return this.parseOp()
    else if (this.currentTokenIs(TOKENS.LABEL)) return this.parseLabel()
    else return null
  }

  private parseOp() {
    const op = new Op(this.currentToken)
    op.mnemonic = this.currentToken.literal

    if (!this.expectPeek(TOKENS.OFFSET) && !this.expectPeek(TOKENS.INT_REGISTER)) {
      return null
    }

    if (this.currentTokenIs(TOKENS.OFFSET)) {
      op.offset = parseInt(this.currentToken.literal)
      this.nextToken()
      if (!this.expectPeek(TOKENS.INT_REGISTER)) {
        return null
      }
      op.rd = this.currentToken.literal
      this.nextToken()
      this.nextToken()
    } else {
      op.rd = this.currentToken.literal
      this.nextToken()
    }

    this.nextToken()

    if (this.currentTokenIs(TOKENS.OFFSET)) {
      op.offset = parseInt(this.currentToken.literal)
      this.nextToken()
      if (!this.expectPeek(TOKENS.INT_REGISTER)) {
        return null
      }
      op.r1 = this.currentToken.literal
      this.nextToken()
    } else {
      op.r1 = this.currentToken.literal
    }

    if (!this.peekTokenIs(TOKENS.COMMA) && !this.peekTokenIs(TOKENS.EOF)) return op

    this.nextToken()

    this.nextToken()
    if (this.currentTokenIs(TOKENS.INT)) {
      op.immediate = parseInt(this.currentToken.literal)
    } else if (this.currentTokenIs(TOKENS.INT_REGISTER)) {
      op.r2 = this.currentToken.literal
    }
    // console.log(this.currentToken)
    return op
  }

  parseLabel() {
    const label = new Label(this.currentToken)
    label.name = this.currentToken.literal

    return label
  }

  /** === Parsing Expressions === */

  /** === Token Handler === */
  private currentTokenIs(token: TokenType) {
    return this.currentToken.type === token
  }

  private peekTokenIs(token: TokenType) {
    return this.peekToken.type === token
  }

  private expectPeek(token: TokenType) {
    if (this.peekTokenIs(token)) {
      this.nextToken()
      return true
    }

    this.peekError(token)
    return false
  }

  /** === Error Handling === */
  private peekError(token: TokenType) {
    // const msg = `expected next token to be ${token}, got ${this.peekToken.type} instead`;
    // console.log(msg)
    // this.errors.push(msg);
  }

  private noPrefixParseFnError(tokenType: TokenType) {
    const msg = `no prefix parse function for ${tokenType} found`
    this.errors.push(msg)
  }
  /** === Error Handling === */
}
