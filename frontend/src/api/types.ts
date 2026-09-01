/** Request body accepted by the DNA analysis endpoint. */
export interface DNAAnalysisRequest {
  sequence: string
}

/** Counts returned for each canonical DNA nucleotide. */
export interface BaseCounts {
  A: number
  T: number
  G: number
  C: number
}

export type IupacAmbiguityCode =
  | 'R'
  | 'Y'
  | 'S'
  | 'W'
  | 'K'
  | 'M'
  | 'B'
  | 'D'
  | 'H'
  | 'V'
  | 'N'

export type AmbiguityCounts = Record<IupacAmbiguityCode, number>

/** Complete analysis returned for a valid DNA sequence. */
export interface DNAAnalysisResponse {
  sequence: string
  length: number
  counts: BaseCounts
  gc_content: number
  gc_content_min: number
  gc_content_max: number
  at_content: number
  ambiguity_count: number
  ambiguity_percentage: number
  ambiguity_counts: AmbiguityCounts
  complement: string
  reverse_complement: string
}

/** Response returned by the backend health-check endpoint. */
export interface HealthResponse {
  status: 'ok'
}
