import { describe, it, expect } from 'vitest';
import {
    isValidHealthResponse,
    isValidTimestamp,
    isNonEmptyString,
    isValidStatus,
} from '../../utils/validators';

describe('isValidHealthResponse', () => {
    it('should return true for a valid health response', () => {
        const valid = { status: 'ok', message: 'Running', timestamp: '2024-01-01T00:00:00Z' };
        expect(isValidHealthResponse(valid)).toBe(true);
    });

    it('should return false when status is missing', () => {
        expect(isValidHealthResponse({ message: 'Hi', timestamp: 'now' })).toBe(false);
    });

    it('should return false for null', () => {
        expect(isValidHealthResponse(null)).toBe(false);
    });

    it('should return false for non-object types', () => {
        expect(isValidHealthResponse('string')).toBe(false);
        expect(isValidHealthResponse(42)).toBe(false);
    });

    it('should return false when a field has wrong type', () => {
        expect(isValidHealthResponse({ status: 123, message: 'ok', timestamp: 'now' })).toBe(false);
    });
});

describe('isValidTimestamp', () => {
    it('should return true for a valid ISO timestamp', () => {
        expect(isValidTimestamp('2024-01-15T10:30:00.000Z')).toBe(true);
    });

    it('should return false for an invalid timestamp string', () => {
        expect(isValidTimestamp('not-a-date')).toBe(false);
    });

    it('should return false for null/undefined', () => {
        expect(isValidTimestamp(null)).toBe(false);
        expect(isValidTimestamp(undefined)).toBe(false);
    });

    it('should return false for non-string types', () => {
        expect(isValidTimestamp(12345)).toBe(false);
    });
});

describe('isNonEmptyString', () => {
    it('should return true for a non-empty string', () => {
        expect(isNonEmptyString('hello')).toBe(true);
    });

    it('should return false for an empty string', () => {
        expect(isNonEmptyString('')).toBe(false);
    });

    it('should return false for whitespace-only string', () => {
        expect(isNonEmptyString('   ')).toBe(false);
    });

    it('should return false for non-string types', () => {
        expect(isNonEmptyString(123)).toBe(false);
        expect(isNonEmptyString(null)).toBe(false);
    });
});

describe('isValidStatus', () => {
    it('should return true for known statuses', () => {
        expect(isValidStatus('ok')).toBe(true);
        expect(isValidStatus('error')).toBe(true);
        expect(isValidStatus('degraded')).toBe(true);
        expect(isValidStatus('maintenance')).toBe(true);
    });

    it('should be case-insensitive', () => {
        expect(isValidStatus('OK')).toBe(true);
        expect(isValidStatus('Error')).toBe(true);
    });

    it('should return false for unknown statuses', () => {
        expect(isValidStatus('foo')).toBe(false);
    });

    it('should return false for non-string types', () => {
        expect(isValidStatus(null)).toBe(false);
        expect(isValidStatus(123)).toBe(false);
    });
});
