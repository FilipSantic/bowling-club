const db = require('../config/db');

class User {
  async create(username, password) {
    let sql = `INSERT INTO users(username, password) VALUES('${username}', '${password}')`;

    const [rows, fields] = await db.execute(sql);
    return rows.insertId;
  }

  async findOne(username) {
    let sql = `SELECT * FROM users WHERE username = '${username}';`;

    const result = await db.execute(sql);

    if(result[0].length > 0) {
      return true;
    }

    return false;
  }
}

module.exports = User;