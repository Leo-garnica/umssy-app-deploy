import bcrypt from 'bcrypt';

const suppliedHash = '$2b$10$fmcDHfMk2CHJFzi2p8jVteI9OsfQ4M/XgtfWXRPDlIFFgXUZ.HQb6';
const matches = await bcrypt.compare('Prueba123', suppliedHash);
console.log(`El hash del SQL original corresponde a Prueba123: ${matches}`);

if (!matches) {
  const hash = await bcrypt.hash('Prueba123', 10);
  console.log('Ejecuta este SQL en Supabase para corregir la contraseña de prueba:');
  console.log(`UPDATE "users" SET "password" = '${hash}', "updated_at" = NOW() WHERE "email" = 'prueba@umss.edu.bo';`);
}
