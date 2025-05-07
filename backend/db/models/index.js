// backend/db/models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

if (process.env.NODE_ENV === 'production') {
  sequelize.options.schema = process.env.SCHEMA;
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  // fs
  //   .readdirSync(__dirname)
  //   .filter(file => {
  //     return (
  //       file.indexOf('.') !== 0 &&
  //       file !== basename &&
  //       file.slice(-3) === '.js' &&
  //       !file.startsWith('index')
  //     );
  //   })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
// .forEach(file => {
//   const modelPath = path.join(__dirname, file);
//   const modelModule = require(modelPath);

//   if (typeof modelModule === 'function') {
//     const model = modelModule(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//     console.log(`Loaded model: ${model.name}`);
//   } else {
//     console.warn(`File ${file} does not export a function — skipping`);
//   }
// });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;