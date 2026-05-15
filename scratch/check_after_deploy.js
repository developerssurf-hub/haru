
const fs = require('fs');

async function test(endpoint, jwt) {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `https://api.japonesconharuyokoi.com/api/${endpoint}${separator}populate=*`;
  console.log('Testing:', url);
  try {
    const headers = {};
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
    const res = await fetch(url, { headers });
    const status = res.status;
    const text = await res.text();
    fs.appendFileSync('scratch/api_test_results.txt', `Endpoint: ${endpoint}\nStatus: ${status}\nBody: ${text.substring(0, 100)}...\n\n`);
  } catch (err) {
    fs.appendFileSync('scratch/api_test_results.txt', `Endpoint: ${endpoint}\nError: ${err.message}\n\n`);
  }
}

async function run() {
  if (fs.existsSync('scratch/api_test_results.txt')) fs.unlinkSync('scratch/api_test_results.txt');
  await test('proxima-clases');
}

run();
