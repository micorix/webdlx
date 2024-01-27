import 'mocha/mocha.js'

const { EVENT_RUN_BEGIN, EVENT_RUN_END, EVENT_TEST_FAIL, EVENT_TEST_PASS, EVENT_SUITE_BEGIN, EVENT_SUITE_END } =
  Mocha.Runner.constants


class MyReporter {
  _indents = 0
  _elements = []
  _setTestResults = null

  constructor(runner, mochaInstance) {
    this._setTestResults = mochaInstance.reporterOptions.setTestResults

    const stats = runner.stats

    this.render()

    runner
      .once(EVENT_RUN_BEGIN, () => {
        console.log('start')
      })
      .on(EVENT_SUITE_BEGIN, (suite) => {
        if (suite.root) return

        this._elements.push(
          <span className="block text-lg font-semibold my-1" style={{ marginLeft: `${this._indents}rem` }}>
            {suite.title}
          </span>
        )
        this.increaseIndent()
        this.render()
      })
      .on(EVENT_SUITE_END, () => {
        this.decreaseIndent()
      })
      .on(EVENT_TEST_PASS, (test) => {
        this._elements.push(
          <span className="block text-green-500" style={{ marginLeft: `${this._indents}rem` }}>
            <strong>✅️ PASS:</strong> {test.title}
          </span>
        )
        this.render()
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        this._elements.push(
          <span className="block text-red-400" style={{ marginLeft: `${this._indents}rem` }}>
            <strong>❌ FAIL:</strong> {test.title}
          </span>,
          <pre
            className="mx-5 mt-2 block text-red-400 bg-red-500/10 px-1 py-0.5 rounded text-sm"
            style={{ marginLeft: `${this._indents}rem` }}
          >
            {err.message}
          </pre>
        )
        this.render()
      })
      .once(EVENT_RUN_END, () => {
        this._elements.push(
          <hr className="mt-5 border-gray-800" />,
          <span className="block mt-2">
            <strong className="text-lg">In total</strong>
            <p>
              <strong>passes:</strong> {stats.passes} <br />
              <strong>failures:</strong> {stats.failures}
            </p>
          </span>
        )
      })
  }

  indent() {
    return Array(this._indents).join('  ')
  }

  increaseIndent() {
    this._indents++
  }

  decreaseIndent() {
    this._indents--
  }

  getWrapper() {
    return (
      <div className="p-5" style={{ fontFamily: 'Lato' }}>
        <h2 className="text-2xl font-bold mb-5">Test results</h2>
        {this._elements}
      </div>
    )
  }

  render() {
    this._setTestResults(this.getWrapper())
  }
}

export default MyReporter
