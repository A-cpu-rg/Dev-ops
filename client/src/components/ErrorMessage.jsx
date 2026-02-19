function ErrorMessage({ message = 'Something went wrong', onRetry }) {
    return (
        <div className="error" data-testid="error-message" role="alert">
            <p className="error-text">{message}</p>
            {onRetry && (
                <button onClick={onRetry} data-testid="retry-button">
                    Retry
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
