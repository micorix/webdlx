export const PROGRAM_KIND = {
  PROGRAM: 'PROGRAM',
} as const

export const STATEMENT_KIND = {
  OP: 'OP',
  LABEL: 'LABEL',
  DATA: 'DATA',
} as const

type NodeKind = (typeof PROGRAM_KIND)[keyof typeof PROGRAM_KIND] | (typeof OP_KIND)[keyof typeof OP_KIND]
export interface Node {
  kind: NodeKind
  toString: () => string
}

export interface BaseStatement extends Node {
  kind: keyof typeof STATEMENT_KIND
}

export interface BaseOp extends BaseStatement {
  kind: typeof STATEMENT_KIND.OP
}
