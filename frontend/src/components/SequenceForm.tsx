import type { FormEvent } from 'react'

interface SequenceFormProps {
  sequence: string
  isLoading: boolean
  onSequenceChange: (sequence: string) => void
  onSubmit: () => void | Promise<void>
  onClear: () => void
}

const EXAMPLE_SEQUENCES = ['ATGCGTAC', 'GGCCTTAAGC', 'TACGATCGATGC']

/** Collect the DNA sequence and notify the parent when the user submits it. */
export function SequenceForm({
  sequence,
  isLoading,
  onSequenceChange,
  onSubmit,
  onClear,
}: SequenceFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // Prevent the browser's normal form submission from reloading the page.
    event.preventDefault()
    void onSubmit()
  }

  return (
    <section className="panel input-panel" aria-labelledby="sequence-heading">
      <div className="section-heading">
        <div>
          <p className="step-label">STEP 01</p>
          <h2 id="sequence-heading">Enter a sequence</h2>
        </div>
        <span className="character-count">{sequence.length} characters</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="dna-sequence">
          DNA sequence
        </label>
        <textarea
          id="dna-sequence"
          value={sequence}
          onChange={(event) => onSequenceChange(event.target.value)}
          placeholder="For example: ATGCGTAC"
          rows={7}
          spellCheck={false}
          autoCapitalize="characters"
          disabled={isLoading}
          aria-describedby="sequence-help"
        />
        <p id="sequence-help" className="field-help">
          Use A, T, G, and C. Whitespace is removed and letters are converted to
          uppercase automatically.
        </p>

        <div className="example-sequences" aria-label="Example DNA sequences">
          <span>Try an example</span>
          {EXAMPLE_SEQUENCES.map((example) => (
            <button
              className="example-chip"
              type="button"
              key={example}
              onClick={() => onSequenceChange(example)}
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>

        <div className="form-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClear}
            disabled={isLoading || sequence.length === 0}
          >
            Clear
          </button>
          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze sequence'}
          </button>
        </div>
      </form>
    </section>
  )
}
