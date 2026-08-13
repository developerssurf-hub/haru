const http = require('http');

fetch('http://localhost:1337/api/users?populate=role&populate=programa')
  .then(res => res.json())
  .then(data => {
    console.log("USERS FETCHED:", data.length);
    const abril = data.find(u => u.username && u.username.includes("Abril"));
    if (abril) {
      console.log("Found Abril:", JSON.stringify(abril, null, 2));
    } else {
      console.log("Abril not found in users API");
    }
  })
  .catch(err => console.error("Error fetching", err));
