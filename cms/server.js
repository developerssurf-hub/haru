try {
  const strapi = require('@strapi/strapi');
  const path = require('path');

  process.chdir(__dirname);

  console.log('--- Iniciando Búnker Strapi ---');
  console.log('CWD:', process.cwd());
  console.log('DB:', process.env.DATABASE_CLIENT);
  console.log('PORT:', process.env.PORT || 1337);

  const start = async () => {
    try {
      console.log('⏳ Creando instancia...');
      const app = strapi();
      
      console.log('⏳ Iniciando servidor...');
      await app.start();
      
      console.log('🚀 ¡STRAPI ESTÁ VIVO!');
    } catch (error) {
      console.error('❌ ERROR DURANTE EL START:');
      console.error(error);
      process.exit(1);
    }
  };

  start();

} catch (globalError) {
  console.error('❌ ERROR GLOBAL (Probablemente memoria o binarios):');
  console.error(globalError);
  process.exit(1);
}
