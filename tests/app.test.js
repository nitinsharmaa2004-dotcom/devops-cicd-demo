const request = require('supertest');
const { app } = require('../server');

describe('GET /', () => {
  it('returns the homepage HTML', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('DevOps CI/CD Demo Application');
    expect(res.text).toContain('Running Successfully');
  });

  it('serves the stylesheet', async () => {
    const res = await request(app).get('/style.css');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/css/);
  });
});

describe('GET /health', () => {
  it('returns status UP in JSON format', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body.status).toBe('UP');
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
  });
});

describe('GET /api/info', () => {
  it('returns app name, Node.js version and environment', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body.appName).toBe('DevOps CI/CD Demo Application');
    expect(res.body.nodeVersion).toBe(process.version);
    expect(res.body.environment).toBeDefined();
  });
});

describe('404 handler', () => {
  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
