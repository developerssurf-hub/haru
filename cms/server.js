const strapi = require('@strapi/strapi');
const path = require('path');

// Forzamos el directorio de trabajo a la carpeta donde está este archivo
// Esto soluciona el problema de Hostinger ejecutando desde /nodejs
process.chdir(__dirname);

console.log('--- Iniciando Strapi (Modo Resiliente) ---');
console.log('Directorio de ejecución real:', process.cwd());
console.log('DATABASE_CLIENT detectado:', process.env.DATABASE_CLIENT);
console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
console.log('PORT asignado por host:', process.env.PORT || 1337);
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('⏳ Intentando arrancar Strapi...');
strapi().start().then(() => {
  console.log('🚀 Strapi arrancó con éxito!');
  console.log('Servidor escuchando en el puerto:', process.env.PORT || 1337);
}).catch(err => {
  console.error('❌ ERROR CRÍTICO:');
  console.error(err);
  process.exit(1);
});
