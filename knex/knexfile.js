

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 require('dotenv').config();
 
 console.log(process.env.DB_HOST)
module.exports = {
  development: {
  client: 'mysql',
  connection: {
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_OvnerRip,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
  },
  useNullAsDefault: true

  /*
  development: {
    client: 'mysql2',
    connection: {
      host:process.env.DB_HOST,
      port:process.env.DB_PORT,
      user:process.env.DB_OvnerRip,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_NAME
    },
  
  migrations:{
    tableName: 'migrations',
    directory: "../src/database/migrations"
  },
  seeds:{
    directory:'../src/database/seeds'
  },
},
*/
  }
};
