
async function testEndpoints() {
  const baseUrl = 'https://api.japonesconharuyokoi.com/api';
  const endpoints = ['blogs', 'proximas-clase', 'proximas-clases', 'proxima-clase', 'proxima-clases'];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const res = await fetch(`${baseUrl}/${endpoint}?populate=*`);
      const data = await res.json();
      console.log(`Response for ${endpoint}:`, JSON.stringify(data, null, 2).substring(0, 500));
    } catch (e) {
      console.log(`Error testing ${endpoint}:`, e.message);
    }
  }
}

testEndpoints();
