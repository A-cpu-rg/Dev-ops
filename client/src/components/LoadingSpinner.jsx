function LoadingSpinner({ message = 'Loading backend status...' }) {
    return (
        <div className="loading" data-testid="loading-spinner" role="status">
            <p>{message}</p>
        </div>
    );
}

export default LoadingSpinner;
