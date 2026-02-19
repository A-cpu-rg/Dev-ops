import { describe, it, expect } from 'vitest';
import {
    formatTimestamp,
    formatStatus,
    truncateMessage,
    capitalizeFirst,
    getStatusColor,
} from '../../utils/formatters';

describe('formatTimestamp', () => {
    it('should format a valid ISO timestamp', () => {
        const result = formatTimestamp('2024-01-15T10:30:00.000Z');
        expect(result).toBeTruthy();
        expect(result).not.toBe('N/A');
        expect(result).not.toBe('Invalid Date');
    });

    it('should return "N/A" for null or undefined', () => {
        expect(formatTimestamp(null)).toBe('N/A');
        expect(formatTimestamp(undefined)).toBe('N/A');
        expect(formatTimestamp('')).toBe('N/A');
    });

    it('should return "Invalid Date" for an invalid string', () => {
        expect(formatTimestamp('not-a-date')).toBe('Invalid Date');
    });
});

describe('formatStatus', () => {
    it('should format "ok" status with checkmark emoji', () => {
        expect(formatStatus('ok')).toBe('✅ OK');
    });

    it('should format "error" status with cross emoji', () => {
        expect(formatStatus('error')).toBe('❌ Error');
    });

    it('should format "degraded" status with warning emoji', () => {
        expect(formatStatus('degraded')).toBe('⚠️ Degraded');
    });

    it('should return unknown indicator for null/undefined', () => {
        expect(formatStatus(null)).toBe('❓ Unknown');
        expect(formatStatus(undefined)).toBe('❓ Unknown');
    });

    it('should capitalize and prefix unknown statuses', () => {
        expect(formatStatus('maintenance')).toBe('🔵 Maintenance');
    });
});

describe('truncateMessage', () => {
    it('should not truncate short messages', () => {
        expect(truncateMessage('Hello')).toBe('Hello');
    });

    it('should truncate long messages and add ellipsis', () => {
        const long = 'A'.repeat(150);
        const result = truncateMessage(long, 100);
        expect(result).toHaveLength(103); // 100 + '...'
        expect(result.endsWith('...')).toBe(true);
    });

    it('should return empty string for falsy input', () => {
        expect(truncateMessage(null)).toBe('');
        expect(truncateMessage('')).toBe('');
    });
});

describe('capitalizeFirst', () => {
    it('should capitalize the first letter', () => {
        expect(capitalizeFirst('hello')).toBe('Hello');
    });

    it('should return empty string for falsy input', () => {
        expect(capitalizeFirst('')).toBe('');
        expect(capitalizeFirst(null)).toBe('');
    });
});

describe('getStatusColor', () => {
    it('should return "status-ok" for ok status', () => {
        expect(getStatusColor('ok')).toBe('status-ok');
    });

    it('should return "status-error" for error status', () => {
        expect(getStatusColor('error')).toBe('status-error');
    });

    it('should return "status-degraded" for degraded status', () => {
        expect(getStatusColor('degraded')).toBe('status-degraded');
    });

    it('should return "status-unknown" for null/undefined', () => {
        expect(getStatusColor(null)).toBe('status-unknown');
    });

    it('should return "status-unknown" for unrecognized status', () => {
        expect(getStatusColor('foo')).toBe('status-unknown');
    });
});
