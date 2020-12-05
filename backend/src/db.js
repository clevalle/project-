const fs = require('fs');
const {Pool} = require('pg');

require('dotenv').config();
process.env.POSTGRES_DB='test';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const run = async (file) => {
  const content = fs.readFileSync(file, 'utf8');
  const statements = content.split(/\r?\n/);
  for (statement of statements) {
    await pool.query(statement);
  }
};

exports.selectEmails = async (mailbox) => {
  let select = '';
  if (mailbox == undefined) {
    select = 'SELECT * FROM mail';
  } else {
    select = 'SELECT * FROM mail WHERE mailbox = $1';
  }
  const query = {
    text: select,
    values: mailbox ? [`${mailbox}`] : [],
  };
  const {rows} = await pool.query(query);
  return rows.length > 0 ? rows : undefined;
};
exports.putEmail = async (id, unread, mailbox, starred) => {
    // console.log('id: '+id);
    // console.log('unread: '+unread);
    // console.log('mailbox='+mailbox);
    console.log('starred='+starred);
    if (unread) {
        const update = `UPDATE mail SET mail = jsonb_set(mail, '{unread}', '"false"') WHERE ID = $1`;
        const query = {
            text: update,
            values: [id],
          };
        await pool.query(query);
    } else  if (mailbox) {
        const update = `UPDATE mail SET mailbox = $1 WHERE ID = $2`;
        const query = {
            text: update,
            values: [mailbox, id],
          };
        await pool.query(query);
    } else {

        const update = `UPDATE mail SET mail = jsonb_set(mail, '{starred}', $1) WHERE ID = $2`;
        const query = {
            text: update,
            values: [starred, id],
          };
        await pool.query(query);
    }
  };

exports.createDB = async () => {
    await run('sql/schema.sql');
    await run('sql/data.sql');
    await run('sql/indexes.sql');
  };