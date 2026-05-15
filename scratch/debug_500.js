async function test(endpoint) {
  const url = `https://api.japonesconharuyokoi.com/api/${endpoint}`;
  console.log('Testing:', url);
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    console.log('Headers:', JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2));
    const text = await res.text();
    console.log('Body:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function run() {
  await test('proxima-clases?publicationState=live');
}

run();
