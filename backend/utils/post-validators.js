const { check } = require('express-validator');
const { handleValidationErrors } = require('./validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors
];

// const validateReview = [
//   check('review')
//     .exists({ checkFalsy: true })
//     .withMessage('Review text is required'),
//   check('stars')
//     .isInt({ min: 1, max: 5 })
//     .withMessage('Stars must be an integer from 1 to 5'),
//   handleValidationErrors
// ];

// const validateBooking = [
//   check('startDate')
//     .exists({ checkFalsy: true })
//     .custom((value) => {
//         const startDate = new Date(value);
//         const today = new Date();
//         if (startDate < today) {
//           throw new Error('startDate cannot be in the past');
//         }
//         return true;
//   }),
//   check('endDate')
//     .exists({ checkFalsy: true })
//     .custom((value, { req }) => {
//         const endDate = new Date(value);
//         const startDate = new Date(req.body.startDate);
//         if (endDate <= startDate) {
//           throw new Error('endDate cannot be on or before startDate');
//         }
//         return true;
//   }),
//   handleValidationErrors
// ];

// const validateNewSpot = [
//   check('address')
//     .exists({ checkFalsy: true })
//     .withMessage('Street address is required'),
//   check('city')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('City is required'),
//   check('state')
//     .exists({ checkFalsy: true })
//     .withMessage('State is required'),
//   check('country')
//     .exists({ checkFalsy: true })
//     .withMessage('Country is required'),
//   check('lat')
//     .exists({ checkFalsy: true })
//     .isFloat({ min: -90, max: 90 }) // range req. -90 < 90
//     .withMessage('Latitude must be within -90 and 90'),
//   check('lng')
//     .exists({ checkFalsy: true })
//     .isFloat({ min: -180, max: 180 })// range req. -180 < 180
//     .withMessage('Longitude must be within -180 and 180'),
//   check('name')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 1, max: 50 })
//     .withMessage('Name must be less than 50 characters'),
//   check('description')
//     .exists({ checkFalsy: true })
//     .withMessage('Description is required'),
//   check('price')
//     .exists({ checkFalsy: true })
//     .isFloat({ min: 0 }) // range req. > 0
//     .withMessage('Price per day must be a positive number'),
//   handleValidationErrors
// ];

// const validateQueryParamsForSpots = [
//   check('page')
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage('Page must be greater than or equal to 1'),
//   check('size')
//     .optional()
//     .isInt({ min: 1, max: 20 })
//     .withMessage('Size must be between 1 and 20'),
//   check('minLat')
//     .optional()
//     .isFloat({ min: -90 })
//     .withMessage('Minimum latitude is invalid'),
//   check('maxLat')
//     .optional()
//     .isFloat({ max: 90 })
//     .withMessage('Maximum latitude is invalid'),
//   check('minLng')
//     .optional()
//     .isFloat({ min: -180 })
//     .withMessage('Minimum longitude is invalid'),
//   check('maxLng')
//     .optional()
//     .isFloat({ max: 180 })
//     .withMessage('Maximum longitude is invalid'),
//   check('minPrice')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Minimum price must be greater than or equal to 0'),
//   check('maxPrice')
//     .optional()
//     .isFloat({ min: 0 })
//     .withMessage('Maximum price must be greater than or equal to 0'),
//   handleValidationErrors
// ];



module.exports = {
  validateLogin
  // ,
  // validateReview,
  // validateBooking,
  // validateNewSpot,
  // validateQueryParamsForSpots
};