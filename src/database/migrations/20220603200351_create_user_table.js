/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Announcement',(table)=>{
        table.increments('id',10).primary()
        table.string('title',50).unique().notNull()
        table.string('annonse',2000).notNull()
        table.enu('status',['visible','unvisible']).notNull()
        table.datetime('time_event', { precision: 6 }).defaultTo(knex.fn.now(6))
        table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));

    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('Announcement')
};
