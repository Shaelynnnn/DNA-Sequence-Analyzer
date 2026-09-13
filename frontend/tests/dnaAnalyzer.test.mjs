import assert from 'node:assert/strict'
import { test } from 'node:test'
import { analyzeDnaLocally } from '../src/utils/dnaAnalyzer.ts'
import { parseSequenceFile } from '../src/utils/sequenceFile.ts'

test('normalizes a sequence and calculates composition and complements', () => {
  const result = analyzeDnaLocally(' atgc\n ')
  assert.equal(result.sequence, 'ATGC')
  assert.equal(result.length, 4)
  assert.deepEqual(result.counts, { A: 1, T: 1, G: 1, C: 1 })
  assert.equal(result.gc_content, 50)
  assert.equal(result.at_content, 50)
  assert.equal(result.complement, 'TACG')
  assert.equal(result.reverse_complement, 'GCAT')
})

test('accounts for ambiguous nucleotides in both composition and complements', () => {
  const result = analyzeDnaLocally('ATGN')
  assert.equal(result.gc_content, 37.5)
  assert.equal(result.gc_content_min, 25)
  assert.equal(result.gc_content_max, 50)
  assert.equal(result.ambiguity_percentage, 25)
  assert.equal(result.reverse_complement, 'NCAT')
  const ambiguous = analyzeDnaLocally('RYSWKMBDHVN')
  assert.equal(ambiguous.gc_content, 50)
  assert.equal(ambiguous.gc_content_min, 9.09)
  assert.equal(ambiguous.gc_content_max, 90.91)
  assert.equal(ambiguous.reverse_complement, 'NBDHVKMWSRY')
})

test('rejects empty and invalid input', () => {
  assert.throws(() => analyzeDnaLocally(' \n\t'), /cannot be empty/)
  assert.throws(() => analyzeDnaLocally('ATGU1!'), /invalid characters: !, 1, U/)
})

test('reads FASTA with a BOM and rejects multiple records and oversized files', async () => {
  const parsed = await parseSequenceFile(new File(['\uFEFF>example\natgc\ngg'], 'example.fa'))
  assert.equal(parsed.sequence, 'ATGCGG')
  await assert.rejects(parseSequenceFile(new File(['>a\nAT\n>b\nGC'], 'two.fa')), /multiple records/)
  await assert.rejects(parseSequenceFile(new File(['A'.repeat(5 * 1024 * 1024 + 1)], 'large.txt')), /5 MB/)
})
