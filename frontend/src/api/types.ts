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

/** Complete analysis returned for a valid DNA sequence. */
export interface DNAAnalysisResponse {
  sequence: string
  length: number
  counts: BaseCounts
  gc_content: number
  at_content: number
  complement: string
  reverse_complement: string
}

/** Response returned by the backend health-check endpoint. */
export interface HealthResponse {
  status: 'ok'
}
