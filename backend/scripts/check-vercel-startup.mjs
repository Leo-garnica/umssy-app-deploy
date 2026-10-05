// Run after `pnpm build`. Reproduce Vercel's interception of server.listen()
// during module loading, without connecting to or changing a database.
import http from 'node:http';

process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USER = 'startup-check';
process.env.DB_PASSWORD = 'startup-check';
process.env.DB_NAME = 'startup-check';
process.env.JWT_SECRET = 'startup-check-only';
process.env.CORS_ORIGIN = 'https://frontend.example';

const { PrismaService } = await import('../dist/common/prisma/prisma.service.js');
PrismaService.prototype.onModuleInit = async function () {};

const originalListen = http.Server.prototype.listen;
let capturedServer;
let signalServer;
const serverFound = new Promise((resolve) => { signalServer = resolve; });

http.Server.prototype.listen = function () {
  capturedServer = this;
  http.Server.prototype.listen = originalListen;
  signalServer();
  return this;
};

let timeout;
try {
  const imported = import('../dist/main.js');
  await Promise.race([
    imported,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error(
        'El módulo no termina de cargar cuando Vercel intercepta listen(): bloqueo de arranque.',
      )), 3_000);
    }),
  ]);
  clearTimeout(timeout);
  await Promise.race([
    serverFound,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error('No se detectó el servidor HTTP.')), 3_000);
    }),
  ]);
  clearTimeout(timeout);

  // Vercel binds the intercepted server only after the module import finishes.
  await new Promise((resolve) => originalListen.call(capturedServer, 0, '127.0.0.1', resolve));
  const address = capturedServer.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/api`);
  if (response.status !== 200 || await response.text() !== 'Hello World!') {
    throw new Error('El servidor capturado no responde correctamente a /api.');
  }
  console.log('Arranque con la intercepción de Vercel: OK; GET /api: 200.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  clearTimeout(timeout);
  http.Server.prototype.listen = originalListen;
  capturedServer?.close();
  // The intentionally blocked import or idle pools must not keep this check open.
  process.exit(process.exitCode ?? 0);
}
