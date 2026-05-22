async function test() {
  const endpoints = [
    'cursos',
    'mapeo-lecciones',
    'mapeo-leccions',
    'mapeos-lecciones',
    'mapeolecciones',
    'mapeo-leccion'
  ];
  for (const ep of endpoints) {
    const url = `https://api.japonesconharuyokoi.com/api/${ep}`;
    console.log('Fetching', url);
    try {
      const res = await fetch(url);
      console.log(`${ep} status:`, res.status);
      const data = await res.json();
      console.log(`${ep} sample:`, JSON.stringify(data).substring(0, 200));
    } catch (err) {
      console.error(`${ep} error:`, err);
    }
  }
}

test();
