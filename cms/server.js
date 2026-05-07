const strapi = require('@strapi/strapi');

console.log('--- Iniciando Strapi en Hostinger ---');
console.log('Directorio actual:', process.cwd());
console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT);

strapi().start().catch(err => {
  console.error('❌ ERROR CRÍTICO AL ARRANCAR STRAPI:');
  console.error(err);
  process.exit(1);
});
