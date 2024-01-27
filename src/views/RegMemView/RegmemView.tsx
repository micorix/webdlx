import AppLayout from '../../components/AppLayout.tsx'
import { useProcessorContext } from '../../contexts/processorContext.tsx'

const RegMemView = () => {
  const { registers, memory } = useProcessorContext()

  return (
    <AppLayout>
      <div className="p-5">
        <div className="mb-10">
          <h1 className="text-2xl">Registers & Memory</h1>
        </div>
        <h2 className="text-xl">Int registers</h2>
        {registers && (
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {Object.keys(registers.intRegisters).map((key, index): any => (
              <div className="py-2 px-4 rounded bg-[#1d1c27] " key={index}>
                <span className="block text-sm text-center text-[#736d80]">R{key}</span>
                <span
                  className={[
                    'block text-center ',
                    registers.intRegisters[key] !== 0 ? 'font-bold text-white' : 'text-[#736d80]',
                  ].join(' ')}
                >
                  {registers.intRegisters[key]}
                </span>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-xl">Memory</h2>
        <table className="mt-2">
          <thead>
            <tr>
              <th>Address</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(memory.serialize()).map(([address, value], index) => (
              <tr key={index}>
                <td>{address}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}

export default RegMemView
