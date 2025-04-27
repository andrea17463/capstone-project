// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const { restoreUser } = require('../utils/auth.js');

router.use(restoreUser);

router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  console.log("XSRF-TOKEN", csrfToken);
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

router.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
  const path = require('path');

  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });

  router.use(express.static(path.resolve("../frontend/dist")));

  router.get(/^(?!\/?api).*/, (req, res) => {
    // console.log('Catching non-API route:', req.path);

    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });
}

if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    return res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });
}

module.exports = router;