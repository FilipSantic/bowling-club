const db = require('../config/db');

class Game {
  async create(user_id) {
    let sql = `INSERT INTO games(user_id, score, ongoing) VALUES('${user_id}', '0', '1')`;
    const result = await db.execute(sql);

    return result;
  }

  async load(user_id) {
    let sql = `SELECT * FROM games WHERE user_id = '${user_id}' AND ongoing = '1';`;
    const [rows] = await db.execute(sql);
    
    if(rows.length > 0) {
      return rows[0];
    }

    return false;
  }

  async save(user_id) {
  }
}

module.exports = Game;