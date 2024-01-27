import { Monaco } from '@monaco-editor/react'
import { mnemonics } from '../../lib/dlx/definitions/operationsDefinitions.ts'
import { foregroundColors } from 'chalk'

export const DLX_ASM_LANG = 'dlxAsm'

export const configureMonaco = (monaco: Monaco) => {
  monaco.languages.register({ id: DLX_ASM_LANG })
  monaco.languages.setMonarchTokensProvider(DLX_ASM_LANG, {
    keywords: [...mnemonics],
    tokenizer: {
      root: [
        [/R\d+/, 'register'],
        [/\.\w+/, 'directive'],
        [/\w+:/, 'label'],
        [
          /[a-zA-Z_][\w]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],
        [/\d+/, 'number'],
        [/[,]/, 'delimiter'],
        [/[;].*/, 'comment'],
        [/[\s]+/, 'white'],
      ],
    },
  })
  monaco.editor.defineTheme('webdlx', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '#B391EE' },
      { token: 'number', foreground: 'b5cea8' },
      { token: 'delimiter', foreground: 'd4d4d4' },
      { token: 'comment', foreground: '6a9955' },
      { token: 'identifier', foreground: 'd4d4d4' },
      { token: 'white', foreground: 'd4d4d4' },
      { token: 'register', foreground: '#619BBD' },
      { token: 'label', foreground: '#d59635' },
      { token: 'directive', foreground: '#DD6977' },
    ],
    colors: {
      'editor.background': '#171622',
    },
  })
  monaco.editor.setTheme('webdlx')
}

export default configureMonaco
