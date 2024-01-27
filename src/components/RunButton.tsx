import toast from 'react-hot-toast'
import { BsPlay } from 'react-icons/bs'
import { useProcessorContext } from '../contexts/processorContext.tsx'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'

const RunDropdown = () => {
  const { runCode } = useProcessorContext()
  const handleClick = () => {
    toast.promise(runCode(), {
      loading: 'Running simulation...',
      success: <b>Simulation finished!</b>,
      error: <b>Simulation was terminated because of the timeout</b>,
    })
  }

  return (
    <div className="mt-2 py-2 px-2 rounded border border-gray-600">
      <span className="block text-white/60 whitespace-nowrap">
        <div className="flex items-center">
          <label className="mr-2 select-none leading-none text-white" htmlFor="c1">
            Enable forwarding
          </label>
          <Checkbox.Root
            className="flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white/10 outline-none cursor-not-allowed"
            defaultChecked={false}
            disabled={true}
            id="c1"
          >
            <Checkbox.Indicator className="">
              <CheckIcon className="w-[20px] h-[20px]" />
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>
      </span>
      <div className="mt-2">
        <button
          onClick={handleClick}
          className="bg-[#39A86B] text-[#16241D] h-8 px-2 flex items-center justify-center rounded w-full"
        >
          <BsPlay className="w-8 h-8" />
          <span className="">Run</span>
        </button>
      </div>
    </div>
  )
}

const RunButton = () => {
  return (
    <div className="group relative">
      <button className="bg-[#16241D] text-[#39A86B] h-8 px-2 flex items-center justify-center rounded">
        <BsPlay className="w-8 h-8" />
        <span className="">Run</span>
      </button>
      <div className="group-hover:block hidden top-full right-0 absolute bg-[#1D1C27] z-10">
        <RunDropdown />
      </div>
    </div>
  )
}

export default RunButton
