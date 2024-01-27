import { OpType } from './definitions/operationsDefinitions.ts'
import opTypesImplementations from './definitions/opTypesImpl.ts'

export const getStageImplementation = (opType: OpType, stage: string) => {
  try {
    return opTypesImplementations[opType][stage]
  } catch {
    throw new Error(`Stage ${stage} for opType ${opType} not found`)
  }
}
