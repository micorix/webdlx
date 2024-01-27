import { createContext, useContext, useState } from 'react'

export interface CodeContextType {
  code: string
  setCode: (code: string) => void
}

const codeContext = createContext<CodeContextType>({
  code: '',
  setCode: () => {},
})

export const useCodeContext = () => useContext(codeContext)

export const CodeContextProvider = ({ children }) => {
  const [code, _setCode] = useState(window.localStorage.getItem('code') || '')

  const setCode = (code: string) => {
    _setCode(code)
    window.localStorage.setItem('code', code)
  }

  return <codeContext.Provider value={{ code, setCode }}>{children}</codeContext.Provider>
}
