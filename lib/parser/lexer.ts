import { lookupIdent, Token, TOKENS, TokenType } from './token.ts'

export class Lexer {
  input: string
  position: number
  readPosition: number
  char: string

  INITIAL_POSITION = 0
  EMPTY_CHAR = ''

  constructor(input: string) {
    this.input = input
    this.setUpInitialState()
    this.readChar()
  }

  nextToken(): Token {
    const token = this.getToken()
    return token
  }

  private setUpInitialState() {
    this.position = this.INITIAL_POSITION
    this.readPosition = this.INITIAL_POSITION
    this.char = this.EMPTY_CHAR
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.char = ''
    } else {
      this.char = this.input[this.readPosition]
    }

    this.position = this.readPosition
    this.readPosition += 1
  }

  private getToken(): Token {
    this.skipWhitespace()
    switch (this.char) {
      case ',':
        return this.buildToken(TOKENS.COMMA, ',')
      case '':
        return this.buildToken(TOKENS.EOF, '')
      case 'R':
        if (this.isDigit(this.peekChar().next().value)) {
          this.readChar()
          const tokenLiteral = this.readNumber()
          return new Token(TOKENS.INT_REGISTER, `R${tokenLiteral}`)
        }
      case '(':
        return this.buildToken(TOKENS.LPAREN, '(')
      case ')':
        return this.buildToken(TOKENS.RPAREN, ')')
      case '.':
        this.readChar()
        const tokenLiteral = this.readIdentifier()
        return new Token(TOKENS.DIRECTIVE, tokenLiteral)
      default:
        if (this.isLetter(this.char)) {
          const tokenLiteral = this.readIdentifier()

          if (this.peekChar(this.position).next().value === ':') {
            this.readChar()
            return new Token(TOKENS.LABEL, tokenLiteral)
          }

          const tokenType = lookupIdent(tokenLiteral)
          return new Token(tokenType, tokenLiteral)
        }

        if (this.isDigit(this.char)) {
          if (this.peekCharAfterNumber() === '(') {
            const tokenLiteral = this.readNumber()
            return new Token(TOKENS.OFFSET, tokenLiteral)
          }
          const tokenLiteral = this.readNumber()
          return new Token(TOKENS.INT, tokenLiteral)
        }

        return new Token(TOKENS.ILLEGAL, this.char)
    }
  }

  private buildToken(type: TokenType, literal: string) {
    this.readChar()
    return new Token(type, literal)
  }

  private readIdentifier() {
    const initialCharPosition = this.position

    while (this.isLetter(this.char)) {
      this.readChar()
    }

    return this.input.substring(initialCharPosition, this.position)
  }

  private readNumber() {
    const initialIntPosition = this.position

    while (this.isDigit(this.char)) {
      this.readChar()
    }

    return this.input.substring(initialIntPosition, this.position)
  }

  private isLetter(char: string) {
    return ('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z') || char === '_'
  }

  private isDigit(char: string) {
    return '0' <= char && char <= '9'
  }

  private skipWhitespace() {
    while (this.char == ' ' || this.char == '\t' || this.char == '\n' || this.char == '\r') {
      this.readChar()
    }
  }

  private *peekChar(position = this.readPosition) {
    let currentReadPosition = position
    while (currentReadPosition < this.input.length) {
      yield this.input[currentReadPosition]
      currentReadPosition++
    }
    return ''
  }

  private peekCharAfterNumber() {
    const gen = this.peekChar()
    let char = gen.next().value
    while (this.isDigit(char)) {
      char = gen.next().value
    }
    return char
  }
}
