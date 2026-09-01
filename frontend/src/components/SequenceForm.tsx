import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type MouseEvent,
} from 'react'
import { parseSequenceFile } from '../utils/sequenceFile'

interface SequenceFormProps {
  sequence: string
  isLoading: boolean
  onSequenceChange: (sequence: string) => void
  onSubmit: () => void | Promise<void>
  onClear: () => void
}

const EXAMPLE_SEQUENCES = [
  'ATGCGTAC',
  'GGCCTTAAGC',
  'TACGATCGATGC',
  'ATGCRYN',
]

/** Collect the DNA sequence and notify the parent when the user submits it. */
export function SequenceForm({
  sequence,
  isLoading,
  onSequenceChange,
  onSubmit,
  onClear,
}: SequenceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isUploadOpen && !dialog.open) dialog.showModal()
    if (!isUploadOpen && dialog.open) dialog.close()
  }, [isUploadOpen])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // Prevent the browser's normal form submission from reloading the page.
    event.preventDefault()
    void onSubmit()
  }

  async function loadFile(file: File): Promise<void> {
    setFileError(null)

    try {
      const parsedFile = await parseSequenceFile(file)
      onSequenceChange(parsedFile.sequence)
      setFileName(parsedFile.fileName)
      setIsUploadOpen(false)
    } catch (error) {
      setFileName(null)
      setFileError(
        error instanceof Error ? error.message : 'The selected file could not be read.',
      )
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0]
    if (file) void loadFile(file)

    // Let the user select the same file again after clearing or fixing it.
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    if (file && !isLoading) void loadFile(file)
  }

  function handleSequenceChange(value: string): void {
    setFileName(null)
    setFileError(null)
    onSequenceChange(value)
  }

  function handleClear(): void {
    setFileName(null)
    setFileError(null)
    onClear()
  }

  function openUploadDialog(): void {
    setFileError(null)
    setIsDragging(false)
    setIsUploadOpen(true)
  }

  function closeUploadDialog(): void {
    setFileError(null)
    setIsDragging(false)
    setIsUploadOpen(false)
  }

  function handleDialogBackdropClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === event.currentTarget) closeUploadDialog()
  }

  return (
    <section className="panel input-panel" aria-labelledby="sequence-heading">
      <div className="section-heading">
        <div>
          <h2 id="sequence-heading">Enter a sequence</h2>
        </div>
        <span className="character-count">{sequence.length} characters</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-method-heading">
          <div>
            <span className="input-method-number">1</span>
            <label className="field-label" htmlFor="dna-sequence">
              Type or paste a sequence
            </label>
          </div>
          <button
            className="upload-trigger-button"
            type="button"
            onClick={openUploadDialog}
            disabled={isLoading}
            title={fileName ? `Loaded from ${fileName}` : undefined}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
            </svg>
            {fileName ? 'Replace file' : 'Upload file'}
          </button>
        </div>
        <textarea
          id="dna-sequence"
          value={sequence}
          onChange={(event) => handleSequenceChange(event.target.value)}
          placeholder="Paste or type your DNA sequence here…"
          rows={7}
          spellCheck={false}
          autoCapitalize="characters"
          disabled={isLoading}
        />

        <div className="example-sequences" aria-label="Example DNA sequences">
          <span>Try an example</span>
          {EXAMPLE_SEQUENCES.map((example) => (
            <button
              className="example-chip"
              type="button"
              key={example}
              onClick={() => handleSequenceChange(example)}
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
            onClick={handleClear}
            disabled={isLoading || sequence.length === 0}
          >
            Clear
          </button>
          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze sequence'}
          </button>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        className="file-upload-dialog"
        aria-labelledby="upload-dialog-title"
        aria-describedby="upload-dialog-description"
        onCancel={(event) => {
          event.preventDefault()
          closeUploadDialog()
        }}
        onClose={() => setIsUploadOpen(false)}
        onClick={handleDialogBackdropClick}
      >
        <div className="upload-dialog-content">
          <div className="upload-dialog-header">
            <div>
              <span className="upload-dialog-eyebrow">SEQUENCE FILE</span>
              <h3 id="upload-dialog-title">Upload a sequence file</h3>
              <p id="upload-dialog-description">
                Add one FASTA or plain-text sequence. The file is read locally
                in your browser.
              </p>
            </div>
            <button
              className="dialog-close-button"
              type="button"
              onClick={closeUploadDialog}
              aria-label="Close file upload"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div
            className={`file-drop-zone file-drop-zone-dialog${isDragging ? ' is-dragging' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault()
              if (!isLoading) setIsDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsDragging(false)
              }
            }}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              accept=".fasta,.fa,.fna,.txt,text/plain"
              onChange={handleFileChange}
              disabled={isLoading}
              tabIndex={-1}
              aria-hidden="true"
            />
            <div className="upload-icon upload-icon-large" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
              </svg>
            </div>
            <div className="file-drop-copy">
              <strong>Drag and drop your file here</strong>
              <span>FASTA or plain text · .fasta, .fa, .fna, .txt</span>
              <span className="file-size-note">Maximum file size: 5 MB</span>
            </div>
            <button
              className="file-select-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Choose file
            </button>
          </div>

          {fileError && (
            <p className="file-error" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </dialog>
    </section>
  )
}
