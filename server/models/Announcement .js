const knexconf = require('../../config/database');
const Model= require('objection').Model;

//console.log(knexconf)
Model.knex(knexconf)

class Announcement extends Model{
  static get tableName() {
    return 'Announcement'
  }
}

module.exports = Announcement