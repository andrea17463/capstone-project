<<<<<<< Updated upstream:backend/utils/auth.js
=======
// // backend/utils/auth.js
// const jwt = require('jsonwebtoken');
// const { jwtConfig } = require('../config');
// const { User } = require('../db/models');

// const { secret, expiresIn } = jwtConfig;

// const setTokenCookie = (res, user) => {
//   const safeUser = {
//     id: user.id,
//     email: user.email,
//     username: user.username,
//   };
//   const token = jwt.sign(
//     { data: safeUser },
//     secret,
//     { expiresIn: parseInt(expiresIn) }
//   );
//   const isProduction = process.env.NODE_ENV === "production";
//   res.cookie('token', token, {
//     maxAge: expiresIn * 1000,
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction && "Lax"
//   });
//   return token;
// };

// const restoreUser = (req, res, next) => {
//   const { token } = req.cookies;
//   // console.log("Token from cookies:", token);
//   // console.log(req.cookies);
//   req.user = null;
//   if (!token) return next();
//   return jwt.verify(token, secret, null, async (err, jwtPayload) => {
//     if (err) {
//       console.log("JWT Verification Error:", err);
//       return next();
//     }

//     try {
//       const { id } = jwtPayload.data;
//       req.user = await User.findByPk(id, {
//         attributes: {
//           include: ['email', 'createdAt', 'updatedAt']
//         }
//       });
//     } catch (e) {
//       console.log("Error finding user:", e);
//       res.clearCookie('token');
//     }
//     if (!req.user) {
//       // console.log("User not found, clearing token");
//       res.clearCookie('token');
//     }
//     return next();
//   });
// };

// const requireAuth = function (req, _res, next) {
//   if (req.user) return next();
//   const err = new Error('Authentication required');
//   err.title = 'Authentication required';
//   err.errors = { message: 'Authentication required' };
//   err.status = 401;
//   return next(err);
// };

// module.exports = { setTokenCookie, restoreUser, requireAuth };







>>>>>>> Stashed changes:project/backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) }
  );
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie('token', token, {
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "Lax" : "Strict",
  });
<<<<<<< Updated upstream:backend/utils/auth.js

=======
  
>>>>>>> Stashed changes:project/backend/utils/auth.js
  return token;
};

const restoreUser = (req, res, next) => {
  const { token } = req.cookies;

  req.user = null;
  if (!token) return next();

<<<<<<< Updated upstream:backend/utils/auth.js
  // return jwt.verify(token, secret, null, async (err, jwtPayload) => {
=======
>>>>>>> Stashed changes:project/backend/utils/auth.js
  return jwt.verify(token, secret, async (err, jwtPayload) => {
    if (err) {
      console.log("JWT Verification Error:", err);
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt'],
        }
      });
    } catch (e) {
      console.log("Error finding user:", e);
      res.clearCookie('token');
    }

    if (!req.user) {
      console.log("User not found, clearing token");
      res.clearCookie('token');
    }

    return next();
  });
};

const requireAuth = (req, _res, next) => {
  if (req.user) return next();
  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };