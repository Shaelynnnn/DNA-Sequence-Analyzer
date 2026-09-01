const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

const SUPPORTED_EXTENSIONS = ['.fa', '.fasta', '.fna', '.txt'] as const

export interface ParsedSequenceFile {
  sequence: string
  fileName: string
}

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex).toLowerCase()
}

/** Parse a single-sequence FASTA file or a plain-text DNA sequence file. */
export async function parseSequenceFile(file: File): Promise<ParsedSequenceFile> {
  const extension = getFileExtension(file.name)

  if (!SUPPORTED_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXTENSIONS)[number])) {
    throw new Error('Choose a .fasta, .fa, .fna, or .txt file.')
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('The selected file is larger than the 5 MB limit.')
  }

  const content = (await file.text()).replace(/^\uFEFF/, '')
  const lines = content.split(/\r?\n/)
  const headerCount = lines.filter((line) => line.trimStart().startsWith('>')).length

  if (headerCount > 1) {
    throw new Error(
      'This FASTA contains multiple records. Upload a file with one sequence at a time.',
    )
  }

  const sequence = lines
    .filter((line) => !line.trimStart().startsWith('>'))
    .join('')
    .replace(/\s/g, '')
    .toUpperCase()

  if (!sequence) {
    throw new Error('The selected file does not contain a DNA sequence.')
  }

  return { sequence, fileName: file.name }
}

