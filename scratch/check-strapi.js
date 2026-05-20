const STRAPI_URL = 'https://api.japonesconharuyokoi.com';

async function checkCursos() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/cursos?populate=*`);
    const data = await res.json();
    console.log('--- CURSOS DETAILS ---');
    if (data.data && data.data.length > 0) {
      data.data.forEach((curso, idx) => {
        const attributes = curso.attributes || curso;
        console.log(`Course ${idx + 1}: ${attributes.Nombre}`);
        console.log(`- Portada:`, JSON.stringify(attributes.Portada, null, 2));
      });
    } else {
      console.log('No courses found.');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

checkCursos();
