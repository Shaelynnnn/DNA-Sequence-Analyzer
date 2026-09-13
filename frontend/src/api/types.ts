export interface DNAAnalysisRequest {
  sequence: string
}

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

export interface HealthResponse {
  status: 'ok'
}
