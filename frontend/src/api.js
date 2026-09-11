const BASE_URL = 'http://localhost:8080/api';

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // response had no JSON body - fall back to the generic message
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function login(username, password) {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(handleResponse);
}

export function getTasks(status = 'all') {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  return fetch(`${BASE_URL}/tasks${query}`).then(handleResponse);
}

export function getStats() {
  return fetch(`${BASE_URL}/tasks/stats`).then(handleResponse);
}

export function createTask(title) {
  return fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then(handleResponse);
}

export function updateTask(id, updates) {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then(handleResponse);
}

export function deleteTask(id) {
  return fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  }).then(handleResponse);
}
