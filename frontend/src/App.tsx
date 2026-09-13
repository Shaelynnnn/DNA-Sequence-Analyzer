import { useState } from 'react'
import {
  ApiError,
  type DNAAnalysisResponse,
} from './api'
import { AnalysisResult } from './components/AnalysisResult'
import { ErrorMessage } from './components/ErrorMessage'
import { SequenceForm } from './components/SequenceForm'
import { analyzeSequence } from './utils/analyzeSequence'
import './App.css'

function getRequestErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  // A failed fetch normally means the browser could not reach the backend.
  if (error instanceof TypeError) {
    return 'Unable to reach the analysis service. Please try again shortly.'
  }

  if (error instanceof Error) return error.message

  return 'An unexpected error occurred during analysis. Please try again.'
}

function App() {
  const [sequence, setSequence] = useState('')
  const [result, setResult] = useState<DNAAnalysisResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleAnalyze(): Promise<void> {
    if (!sequence.trim()) {
      setResult(null)
      setErrorMessage('Enter a DNA sequence to analyze.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setResult(null)

    try {
      const analysis = await analyzeSequence(sequence)
      setResult(analysis)
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  function handleClear(): void {
    setSequence('')
    setResult(null)
    setErrorMessage(null)
  }

  function handleSequenceChange(value: string): void {
    setSequence(value)
    // Results belong to the submitted sequence, not the next edit or upload.
    setResult(null)
    setErrorMessage(null)
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">DNA SEQUENCE ANALYZER</p>
        <h1>Helixora</h1>
        <p className="intro">
          Check base composition, GC content, and complementary strands.
          Paste a DNA sequence or upload a FASTA file to begin.
        </p>
      </header>

      <SequenceForm
        sequence={sequence}
        isLoading={isLoading}
        onSequenceChange={handleSequenceChange}
        onSubmit={handleAnalyze}
        onClear={handleClear}
      />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {result && <AnalysisResult result={result} />}
    </main>
  )
}

export default App
