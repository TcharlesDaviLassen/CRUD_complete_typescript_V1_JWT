// require('dotenv').config();

// module.exports = {
//     "development": {
//         "username": process.env.DB_USERNAME,
//         "password": process.env.DB_PASSWORD,
//         "database": process.env.DB_DATABASE,
//         "host": process.env.DB_HOST,
//         "port": process.env.DB_PORT,
//         "dialect": process.env.DB_DIALECT
//     }
// };

import sequelize, { Sequelize, Dialect } from 'sequelize';
import * as dotenv from "dotenv";
dotenv.config();

const config = {
    development: {
        database: process.env.DB_DATABASE as string,
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string),
        dialect: process.env.DB_DIALECT as Dialect
    },
};

export { config };
