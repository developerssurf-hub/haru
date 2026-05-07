const strapi = require('@strapi/strapi');
const path = require('path');

// Forzamos el directorio de trabajo a la carpeta donde está este archivo
// Esto soluciona el problema de Hostinger ejecutando desde /nodejs
process.chdir(__dirname);

console.log('--- Iniciando Strapi (Modo Resiliente) ---');
console.log('Directorio de ejecución real:', process.cwd());
console.log('DATABASE_CLIENT detectado:', process.env.DATABASE_CLIENT);

strapi().start().catch(err => {
  console.error('❌ ERROR CRÍTICO:');
  console.error(err);
  process.exit(1);
});
