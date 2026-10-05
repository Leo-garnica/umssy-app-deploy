import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcrypt';

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
  query_timeout: 10_000,
});

try {
  await client.connect();
  console.log('Conexión a PostgreSQL: OK');
  const result = await client.query(
    'SELECT u.password, u.is_active, array_agg(r.name) AS roles FROM users u ' +
    'LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.deleted_at IS NULL ' +
    'LEFT JOIN roles r ON r.id = ur.role_id WHERE u.email = $1 ' +
    'GROUP BY u.id, u.password, u.is_active',
    ['prueba@umss.edu.bo'],
  );
  const user = result.rows[0];
  console.log('Usuario de prueba existe:', Boolean(user));
  if (user) {
    console.log('Usuario activo:', user.is_active);
    console.log('Rol titulado asignado:', user.roles.includes('titulado'));
    console.log('Contraseña Prueba123 válida:', await bcrypt.compare('Prueba123', user.password));
  }
} catch (error) {
  console.error('Falló la comprobación:', error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
