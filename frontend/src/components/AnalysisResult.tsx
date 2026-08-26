import type { DNAAnalysisResponse } from '../api'

interface AnalysisResultProps {
  result: DNAAnalysisResponse
}

interface SequenceRowProps {
  label: string
  value: string
}

function SequenceRow({ label, value }: SequenceRowProps) {
  return (
    <div className="sequence-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/** Present the successful response returned by the DNA analysis API. */
export function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <section className="panel result-panel" aria-labelledby="result-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">STEP 02</p>
          <h2 id="result-heading">Analysis results</h2>
        </div>
        <span className="success-badge">Complete</span>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <span>Sequence length</span>
          <strong>{result.length}</strong>
          <small>bp</small>
        </article>
        <article className="summary-card">
          <span>GC content</span>
          <strong>{result.gc_content.toFixed(2)}</strong>
          <small>%</small>
        </article>
        <article className="summary-card">
          <span>AT content</span>
          <strong>{result.at_content.toFixed(2)}</strong>
          <small>%</small>
        </article>
      </div>

      <div className="result-section">
        <h3>Base counts</h3>
        <dl className="base-counts">
          <div className="base-count base-a">
            <dt>A</dt>
            <dd>{result.counts.A}</dd>
          </div>
          <div className="base-count base-t">
            <dt>T</dt>
            <dd>{result.counts.T}</dd>
          </div>
          <div className="base-count base-g">
            <dt>G</dt>
            <dd>{result.counts.G}</dd>
          </div>
          <div className="base-count base-c">
            <dt>C</dt>
            <dd>{result.counts.C}</dd>
          </div>
        </dl>
      </div>

      <div className="result-section">
        <h3>Sequence details</h3>
        <dl className="sequence-list">
          <SequenceRow label="Normalized sequence" value={result.sequence} />
          <SequenceRow label="Complement" value={result.complement} />
          <SequenceRow
            label="Reverse complement"
            value={result.reverse_complement}
          />
        </dl>
      </div>
    </section>
  )
}
