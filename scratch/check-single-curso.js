const STRAPI_URL = 'https://api.japonesconharuyokoi.com';

async function checkSingleCurso() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/cursos/dc7jkqmvrybg3uom7nxjhjug?populate=*`);
    const data = await res.json();
    console.log('--- SINGLE CURSO RESPONSE ---');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching single course:', error);
  }
}

checkSingleCurso();
