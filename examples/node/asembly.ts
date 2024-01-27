import { Lexer } from '../../lib/parser/lexer.ts'
import { Parser } from '../../lib/parser/parser.ts'
import Assembler from '../../lib/assembler/assembler.ts'
import DLXProcessor from '../../lib/dlx/processor.ts'

const input = `
    .text
    ADDI R1, R0, 20
    ADDI R2, R0, 8
    ADDI R3, R0, 19
    SW 220(R0), R3
`
// SW 220(R0), R1
const lexer = new Lexer(input)
const parser = new Parser(lexer)
const parsedProgram = parser.parseProgram()
console.log(parsedProgram)
const assembler = new Assembler(parsedProgram)
const p = new DLXProcessor()
p.on('instructionDecoded', (decodedInstruction) => {
  console.log('Instruction decoded:', decodedInstruction)
})
p.on('instructionFetched', (instruction) => {
  console.log('Instruction fetched:', instruction)
})

const assembledInstructions = assembler.assembleInstructions()
p.memory.writeProgram(assembledInstructions)

console.log(assembledInstructions)

p.runAll()
// p.memory.write(0, 2)
// console.log(p.memory.read(1000))
console.log(p.registers.intRegisters)
console.log(p.memory.serialize())
