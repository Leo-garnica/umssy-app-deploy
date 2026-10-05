const baseUrl = (process.env.API_BASE_URL ?? 'http://localhost:3101/api').replace(/\/+$/, '');
const origin = 'https://umssy-app-deploy.vercel.app';

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, { ...options, signal: AbortSignal.timeout(20_000) });
}

try {
  const preflight = await request('/auth/login', {
    method: 'OPTIONS',
    headers: { Origin: origin, 'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type' },
  });
  console.log('CORS preflight status:', preflight.status);
  console.log('Origin permitido:', preflight.headers.get('access-control-allow-origin'));

  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ email: 'prueba@umss.edu.bo', password: 'Prueba123', roleTag: 'titulado' }),
  });
  console.log('Login status:', login.status);
  if (!login.ok) throw new Error(`Login falló con HTTP ${login.status}`);
  const session = await login.json();
  if (!session.accessToken) throw new Error('El login no devolvió un token');

  const profile = await request('/profile/me', {
    headers: { Authorization: `Bearer ${session.accessToken}`, Origin: origin },
  });
  console.log('Perfil status:', profile.status);
  if (!profile.ok) throw new Error(`Perfil falló con HTTP ${profile.status}`);
  const body = await profile.json();
  console.log('Perfil recibido:', Boolean(body.data));
} catch (error) {
  console.error('Falló la comprobación:', error.message);
  process.exitCode = 1;
}
