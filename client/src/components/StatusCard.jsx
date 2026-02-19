import { formatTimestamp, formatStatus, getStatusColor } from '../utils/formatters';

function StatusCard({ data }) {
    if (!data) return null;

    return (
        <div className="card" data-testid="status-card">
            <h2>Backend Status</h2>
            <div>
                <p>
                    Status:{' '}
                    <span className={getStatusColor(data.status)} data-testid="status-value">
                        {formatStatus(data.status)}
                    </span>
                </p>
                <p data-testid="message-value">Message: {data.message}</p>
                <p data-testid="timestamp-value">
                    Timestamp: {formatTimestamp(data.timestamp)}
                </p>
            </div>
        </div>
    );
}

export default StatusCard;
