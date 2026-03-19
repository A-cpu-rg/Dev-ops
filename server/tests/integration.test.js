const request = require('supertest');
const app = require('../src/app');

describe('Integration Tests — HTTP API', () => {
  // ── Health endpoint ────────────────────────────────────────────────────────
  describe('GET /api/health', () => {
    it('returns HTTP 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
    });

    it('returns JSON content-type', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('body contains status "ok"', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('status', 'ok');
    });

    it('body contains a message string', async () => {
      const res = await request(app).get('/api/health');
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.length).toBeGreaterThan(0);
    });

    it('body contains a valid ISO timestamp', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('timestamp');
      expect(() => new Date(res.body.timestamp)).not.toThrow();
      expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
    });
  });

  // ── Root endpoint ──────────────────────────────────────────────────────────
  describe('GET /', () => {
    it('returns HTTP 200', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
    });

    it('returns a non-empty text response', async () => {
      const res = await request(app).get('/');
      expect(typeof res.text).toBe('string');
      expect(res.text.length).toBeGreaterThan(0);
    });
  });

  // ── Unknown routes ─────────────────────────────────────────────────────────
  describe('GET /api/unknown', () => {
    it('returns HTTP 404 for undefined routes', async () => {
      const res = await request(app).get('/api/unknown-route-that-does-not-exist');
      expect(res.statusCode).toBe(404);
    });
  });

  // ── CORS headers ───────────────────────────────────────────────────────────
  describe('CORS headers', () => {
    it('includes Access-Control-Allow-Origin on /api/health', async () => {
      const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
