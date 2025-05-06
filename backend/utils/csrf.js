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