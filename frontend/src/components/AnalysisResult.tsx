import type { DNAAnalysisResponse } from '../api'

const IUPAC_MEANINGS = {
  R: 'A or G',
  Y: 'C or T',
  S: 'G or C',
  W: 'A or T',
  K: 'G or T',
  M: 'A or C',
  B: 'C, G, or T',
  D: 'A, G, or T',
  H: 'A, C, or T',
  V: 'A, C, or G',
  N: 'Any base',
} as const

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
  const ambiguityEntries = Object.entries(result.ambiguity_counts).filter(
    ([, count]) => count > 0,
  ) as [keyof typeof IUPAC_MEANINGS, number][]
  const hasAmbiguity = result.ambiguity_count > 0

  return (
    <section className="panel result-panel" aria-labelledby="result-heading">
      <div className="section-heading">
        <div>
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
          <span>{hasAmbiguity ? 'Expected GC content' : 'GC content'}</span>
          <strong>{result.gc_content.toFixed(2)}</strong>
          <small>%</small>
          {hasAmbiguity && (
            <small className="summary-range">
              Range {result.gc_content_min.toFixed(2)}–
              {result.gc_content_max.toFixed(2)}%
            </small>
          )}
        </article>
        <article className="summary-card">
          <span>AT content</span>
          <strong>{result.at_content.toFixed(2)}</strong>
          <small>%</small>
        </article>
      </div>

      {hasAmbiguity && (
        <div className="ambiguity-summary" role="note">
          <div>
            <span className="ambiguity-icon" aria-hidden="true">?</span>
            <div>
              <strong>IUPAC ambiguity detected</strong>
              <p>
                {result.ambiguity_count} of {result.length} bases (
                {result.ambiguity_percentage.toFixed(2)}%) are ambiguous. Content
                values use the expected probability; the GC range shows all
                possible outcomes.
              </p>
            </div>
          </div>
          <dl className="ambiguity-counts">
            {ambiguityEntries.map(([code, count]) => (
              <div key={code}>
                <dt>{code}</dt>
                <dd>{count}</dd>
                <dd className="ambiguity-meaning">{IUPAC_MEANINGS[code]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

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
