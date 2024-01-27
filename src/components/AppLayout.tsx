import { AiFillCode, AiTwotoneCode } from 'react-icons/ai'
import {BsBarChartSteps, BsFileEarmarkText, BsGithub, BsHash, BsLightning, BsPlay} from 'react-icons/bs'
import { GrTest } from 'react-icons/gr'
import { Link, NavLink } from 'react-router-dom'
import { useProcessorContext } from '../contexts/processorContext.tsx'
import RunButton from './RunButton.tsx'
import styles from './styles/AppLayout.module.css'
const paneNav = [
  {
    name: 'Code',
    href: '/',
    icon: AiFillCode,
  },
  {
    name: 'Pipeline',
    href: '/pipeline',
    icon: BsBarChartSteps,
  },
  {
    name: 'REG&MEM',
    href: '/regmem',
    icon: BsHash,
  },
  {
    name: 'Logs',
    href: '/logs',
    icon: BsFileEarmarkText,
  },
  {
    name: 'Tests',
    href: '/tests',
    icon: GrTest,
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: BsLightning,
  },
]
const AppLayout = ({ children }) => {
  const { runCode } = useProcessorContext()
  const run = () => {
    runCode()
  }
  return (
    <div className={styles.app}>
      <div className={styles.navbar}>
        <div className="py-2 px-10 h-full flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold">WebDLX</div>
            <span className="ml-3 text-gray-400">DLX architecture simulator</span>
            <a href="https://github.com/micorix/webdlx" className="ml-3 text-lg">
              <BsGithub />
            </a>
          </div>
          <div className="flex items-center">
            <span className="block mr-4 text-white/60">
              Forwarding: <strong>off</strong>
            </span>
            <div className="flex items-center">
              <RunButton />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        <div className="w-32 h-full border-r border-gray-800">
          <div className="w-full py-5 grid px-2">
            {paneNav.map((item, index) => (
              <NavLink
                to={item.href}
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    'flex items-center justify-center py-2 px-4 rounded hover:bg-[#1d1c27]',
                    isActive ? 'text-white/90' : 'text-[#736d80]',
                  ].join(' ')
                }
                key={index}
              >
                <div className="">
                  <div className="flex justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="block text-center mt-2.5 text-sm">{item.name}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  )
}

export default AppLayout
