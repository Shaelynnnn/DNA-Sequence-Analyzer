// Public API-layer exports keep UI imports independent of the internal layout.
// Expose the shared API error type.
export { ApiError } from './client'
// Expose the business API functions that UI components can call.
export { analyzeDnaSequence, checkApiHealth } from './dna'
// Expose the request and response type definitions.
export type {
  BaseCounts,
  DNAAnalysisRequest,
  DNAAnalysisResponse,
  HealthResponse,
} from './types'
