import { Sequelize, Dialect } from 'sequelize';

import * as dotenv from "dotenv";
dotenv.config();

// import { config } from '../dotEnvConfig/envConfigs';

const dbDatabase = process.env.DB_DATABASE as string;
const dbUsername = process.env.DB_USERNAME as string;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT as Dialect;
const dbPort: number = parseInt(process.env.DB_PORT as string);
const dbPassword = process.env.DB_PASSWORD;

// const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
//   host: config.development.host,
//   port: config.development.port,
//   dialect: config.development.dialect
// });

const sequelize = new Sequelize(dbDatabase, dbUsername, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect
});


// Defina seus modelos e execute operações de banco de dados aqui

sequelize
  .authenticate()
  .then(async () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

export { sequelize };