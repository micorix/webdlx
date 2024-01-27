import { operations } from './definitions/operationsDefinitions.ts'

export const findOperationByOpCode = (opCode: number) => {
  const operation = operations.find((op) => op.opCode === opCode)
  if (!operation) {
    throw new Error(`Operation with opCode ${opCode} not found`)
  }
  return operation
}
