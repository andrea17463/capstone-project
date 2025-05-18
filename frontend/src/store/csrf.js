// frontend/src/store/csrf.js
import Cookies from 'js-cookie';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export async function csrfFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  options.credentials = 'include';

  const res = await window.fetch(fullUrl, options);
  if (res.status >= 400) throw res;
  return res;
}

export function restoreCSRF() {
  return csrfFetch('/csrf/restore');
}