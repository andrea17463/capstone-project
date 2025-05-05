// frontend/src/hooks/extract-cookies-csrf-token.js
import { useEffect, useState } from 'react';

const useExtractCookiesCsrfToken = () => {
    const [csrfToken, setCsrfToken] = useState(null);
    const [cookies, setCookies] = useState('');

    useEffect(() => {
        const allCookies = document.cookie;
        const csrf = allCookies
            .split('; ')
            .find((row) => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        console.log('Document Cookies:', allCookies);
        console.log('Extracted CSRF Token:', csrf);

        setCookies(allCookies);
        setCsrfToken(csrf);
    }, []);

    return { csrfToken, cookies };
};

// const csurf = require('csurf');

// app.use(csurf({ cookie: true }));

// const token = jwt.sign({ data: safeUser }, secret, { expiresIn });
// res.cookie('token', token, {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: isProduction ? 'Lax' : 'Strict',
// });

export default useExtractCookiesCsrfToken;