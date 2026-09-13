import type { AmbiguityCounts, DNAAnalysisResponse } from '../api/types'

const POSSIBLE_BASES: Record<string, string> = {
  A: 'A', T: 'T', G: 'G', C: 'C',
  R: 'AG', Y: 'CT', S: 'GC', W: 'AT', K: 'GT', M: 'AC',
  B: 'CGT', D: 'AGT', H: 'ACT', V: 'ACG', N: 'ACGT',
}

const COMPLEMENT: Record<string, string> = {
  A: 'T', T: 'A', G: 'C', C: 'G',
  R: 'Y', Y: 'R', S: 'S', W: 'W', K: 'M', M: 'K',
  B: 'V', V: 'B', D: 'H', H: 'D', N: 'N',
}

const round = (value: number) => Math.round(value * 100) / 100

export function analyzeDnaLocally(input: string): DNAAnalysisResponse {
  const sequence = input.replace(/\s/g, '').toUpperCase()
  if (!sequence) throw new Error('DNA sequence cannot be empty.')

  const invalid = [...new Set(sequence)].filter((base) => !POSSIBLE_BASES[base]).sort()
  if (invalid.length) {
    throw new Error(`DNA sequence contains invalid characters: ${invalid.join(', ')}`)
  }

  const counts = { A: 0, T: 0, G: 0, C: 0 }
  const ambiguity_counts: AmbiguityCounts = {
    R: 0, Y: 0, S: 0, W: 0, K: 0, M: 0, B: 0, D: 0, H: 0, V: 0, N: 0,
  }
  const allCounts: Record<string, number> = { ...counts, ...ambiguity_counts }
  for (const base of sequence) allCounts[base]++

  let expectedGc = 0
  let minimumGc = 0
  let maximumGc = 0
  for (const [base, count] of Object.entries(allCounts)) {
    const options = POSSIBLE_BASES[base]
    const gcOptions = [...options].filter((value) => value === 'G' || value === 'C').length
    // Each possible nucleotide has equal weight, matching the Python analyzer.
    expectedGc += count * gcOptions / options.length
    if (gcOptions === options.length) minimumGc += count
    if (gcOptions > 0) maximumGc += count
  }
  for (const base of Object.keys(counts) as (keyof typeof counts)[]) counts[base] = allCounts[base]
  for (const base of Object.keys(ambiguity_counts) as (keyof AmbiguityCounts)[]) {
    ambiguity_counts[base] = allCounts[base]
  }

  const ambiguity_count = Object.values(ambiguity_counts).reduce((sum, count) => sum + count, 0)
  const percent = (count: number) => round(count / sequence.length * 100)
  const gc_content = percent(expectedGc)
  const complement = sequence.replace(/./g, (base) => COMPLEMENT[base])

  return {
    sequence,
    length: sequence.length,
    counts,
    gc_content,
    gc_content_min: percent(minimumGc),
    gc_content_max: percent(maximumGc),
    at_content: round(100 - gc_content),
    ambiguity_count,
    ambiguity_percentage: percent(ambiguity_count),
    ambiguity_counts,
    complement,
    reverse_complement: complement.split('').reverse().join(''),
  }
}
