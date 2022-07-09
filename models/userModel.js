const db = require('../config/db');

class User {
  async create(username, password) {
    let sql = `INSERT INTO users(username, password) VALUES('${username}', '${password}')`;
    const result = await db.execute(sql);

    return result;
  }

  async findOne(username) {
    let sql = `SELECT * FROM users WHERE username = '${username}';`;
    const [rows] = await db.execute(sql);

    if(rows.length > 0) {
      return rows[0];
    }

    return false;
  }

  async findById(user_id) {
    let sql = `SELECT * FROM users WHERE id = '${user_id}';`;
    const [rows] = await db.execute(sql);

    if(rows.length > 0) {
      return rows[0];
    }

    return false;
  }
}

module.exports = User;