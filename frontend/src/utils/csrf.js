// frontend/src/utils/csrf.js
// export async function restoreCsrf() {
//     await fetch('http://localhost:3001/api/csrf/restore', {
//       credentials: 'include',
//     });
//   }
export async function restoreCsrf() {
  try {
    await fetch('/api/csrf/restore', {
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error restoring CSRF token:', error);
  }
}

export async function csrfFetch(url, options = {}) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = 'application/json';

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (csrfToken) {
      options.headers['XSRF-TOKEN'] = csrfToken;
    }
  }

  options.credentials = 'include';

  const response = await fetch(url, options);

  if (!response.ok) throw response;

  return response;
}