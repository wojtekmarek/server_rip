const env = "development"
const knexfile = require('../knex/knexfile')
const knex = require('knex')


module.exports = knex(knexfile[env])