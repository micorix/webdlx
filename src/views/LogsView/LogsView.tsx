import AppLayout from '../../components/AppLayout.tsx'
import { useProcessorContext } from '../../contexts/processorContext.tsx'
import { LogViewer, LogViewerSearch } from '@patternfly/react-log-viewer'

const LogsView = () => {
  const { events } = useProcessorContext()

  return (
    <AppLayout>
      <div className="p-5">
        <div className="mb-10">
          <h1>Logs</h1>
        </div>
        <div className="" style={{ fontFamily: 'Fira Code' }}>
          <LogViewer data={events.map((event) => JSON.stringify(event)).join('\n')} isTextWrapped={true} />
        </div>
      </div>
    </AppLayout>
  )
}

export default LogsView
