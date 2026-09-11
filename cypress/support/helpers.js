const API_BASE_URL = 'http://localhost:8080/api';

// Give every test its own uniquely-titled task so tests never collide 
// with each other or with leftover data, and can be re-run safely.
function uniqueTitle(label) {
  return `${label} ${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

module.exports = { API_BASE_URL, uniqueTitle };
