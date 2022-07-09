const db = require('../config/db');

class Game {
  async create(userId) {
    let sql = `INSERT INTO games(user_id, current_frame, bowl_try, score, ongoing) VALUES('${userId}', '1', '1', '0', '1')`;
    let [rows] = await db.execute(sql);

    sql = `SELECT * FROM games WHERE id = '${rows.insertId}' AND user_id = '${userId}' AND ongoing = '1';`;
    [rows] = await db.execute(sql);

    return rows[0];
  }

  async load(userId) {
    let sql = `SELECT * FROM games WHERE user_id = '${userId}' AND ongoing = '1';`;
    const [rows] = await db.execute(sql);
    
    if(rows.length > 0) {
      return rows[0];
    }

    return false;
  }

  async loadAll(userId) {
    let sql = `SELECT * FROM games WHERE user_id = '${userId}' AND ongoing = '0';`;
    const [rows] = await db.execute(sql);
    
    if(rows.length > 0) {
      return rows;
    }

    return false;
  }

  async update(gameId, currentFrame, bowlTry, bowlScore, throwScenario) {
    let sql;
    if(throwScenario === "NORMAL") {
      if(bowlTry == 1) {
        sql = `UPDATE games SET bowl_try = '2', frame_${currentFrame} = '${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
      }
      else {
        if(currentFrame == 10) {
          sql = `UPDATE games SET bowl_try = '0', current_frame = '0', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}', ongoing = '0' WHERE id = '${gameId}';`;
        }
        else {
          let newCurrentFrame = Number(currentFrame);
          newCurrentFrame++;
          sql = `UPDATE games SET bowl_try = '1', current_frame = '${newCurrentFrame}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      }
      await db.execute(sql);
    }
    else if(throwScenario === "SPARE") {
      
    }
    else if(throwScenario === "STRIKE") {
      sql = `UPDATE games SET frame_${currentFrame} = '${bowlScore}', current_frame = '${currentFrame++}' WHERE id = '${gameId}';`;
    }
    else {
      return false;
    }
  }
}

module.exports = Game;