// NKHS NJROTC — Cloudflare Worker
// Serves the site AND handles KV storage reads/writes.

const SECRET_TOKEN = '1234567890';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets for everything except /api/*
    if (!url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    // CORS headers
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Auth check
    const token = request.headers.get('x-auth-token');
    if (token !== SECRET_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/get?key=njrotc-cadets-v3
    if (request.method === 'GET' && url.pathname === '/api/get') {
      const key = url.searchParams.get('key');
      if (!key) return new Response(JSON.stringify({ error: 'Missing key' }), { status: 400, headers: cors });
      const value = await env.NJROTC_KV.get(key);
      return new Response(
        JSON.stringify(value !== null ? { value } : {}),
        { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // POST /api/set  body: { key, value }
    if (request.method === 'POST' && url.pathname === '/api/set') {
      let body;
      try { body = await request.json(); } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: cors });
      }
      const { key, value } = body;
      if (!key || value === undefined) {
        return new Response(JSON.stringify({ error: 'Missing key or value' }), { status: 400, headers: cors });
      }
      await env.NJROTC_KV.put(key, value);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: cors });
  },
};
