interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span className="error-icon" aria-hidden="true">
        !
      </span>
      <div>
        <strong>Unable to complete analysis</strong>
        <p>{message}</p>
      </div>
    </div>
  )
}
