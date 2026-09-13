import { analyzeDnaSequence } from '../api/dna'
import type { DNAAnalysisResponse } from '../api/types'
import { analyzeDnaLocally } from './dnaAnalyzer'

export async function analyzeSequence(sequence: string): Promise<DNAAnalysisResponse> {
  // Pages uses browser analysis; an explicit API URL enables the original backend.
  if (import.meta.env.VITE_API_BASE_URL) return analyzeDnaSequence(sequence)
  return analyzeDnaLocally(sequence)
}
