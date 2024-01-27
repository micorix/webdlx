import { program } from 'commander'
import { readFile } from 'fs/promises'
import { Lexer } from '../lib/parser/lexer'
import { Parser } from '../lib/parser/parser'
import Compiler from '../lib/compiler/compiler'
import DLXProcessor from '../lib/dlx/processor'
import chalk from 'chalk'

program
  .description('REPL for the WebDLX processor simulator')
  .option('-s, --source <path>', 'Path to a file to run')
  .option('-f, --forwarding', 'Enable forwarding')

program.parse()

const options = program.opts()

if (!options.source) {
  console.log('No source file specified')
  process.exit(1)
}

const source = await readFile(options.source, 'utf-8')

console.log(chalk.bold('Loaded source code:'))
console.log(source)

const lexer = new Lexer(source)
const parser = new Parser(lexer)
const parsedProgram = parser.parseProgram()

console.log(chalk.bold('Parsed program:'))
console.log(parsedProgram)

const compiler = new Compiler(parsedProgram)
const p = new DLXProcessor()
p.on('instructionDecoded', (decodedInstruction) => {
  console.log('Instruction decoded:', decodedInstruction)
})
const compiledInstructions = compiler.compileInstructions()
p.memory.writeProgram(compiledInstructions)

console.log(chalk.bold('Compiled program and inserted instructions:'))
console.log(compiledInstructions)

console.log(chalk.bold('Running program:'))
p.runAll()

console.log(chalk.bold('Integer registers:'))
console.table(p.registers.intRegisters)

console.log(chalk.bold('Memory:'))
console.log(p.memory.serialize())
