import React from 'react';
import PropTypes from 'prop-types';

export default function StatusCard({ data }) {
  if (!data) {
    return (
      <div className="card loading-card">
        <div className="spinner"></div>
        <p>Loading backend status...</p>
      </div>
    );
  }

  return (
    <div className="card status-card">
      <div className="card-header">
        <h2>API Status</h2>
        <span className="status-badge pulse">{data.status}</span>
      </div>
      <div className="card-body">
        <p>
          <strong>Message:</strong> {data.message}
        </p>
        <p>
          <strong>Last Checked:</strong> {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

StatusCard.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }),
};
