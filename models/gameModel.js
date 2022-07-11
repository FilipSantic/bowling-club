const db = require("../config/db");

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

    if (rows.length > 0) {
      return rows[0];
    }

    return false;
  }

  async loadAll(userId) {
    let sql = `SELECT * FROM games WHERE user_id = '${userId}' AND ongoing = '0';`;
    const [rows] = await db.execute(sql);

    return rows;
  }

  async update(
    gameId,
    currentFrame,
    bowlTry,
    strikeCount,
    lastFrameScenario,
    bowlScore,
    throwScenario
  ) {
    let sql;
    let currentFrameNumber = Number(currentFrame);
    let beforeLastFrame = currentFrameNumber - 2;
    let lastFrame = --currentFrameNumber;
    let newCurrentFrame = currentFrameNumber + 2;

    if (throwScenario === "NORMAL") {
      if (bowlTry == 1) {
        if (lastFrameScenario == "spare") {
          sql = `UPDATE games SET bowl_try = '2', bowl_1_score = '${bowlScore}', frame_score = '${bowlScore}', strike_count = '0', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        } else {
          sql = `UPDATE games SET bowl_try = '2', bowl_1_score = '${bowlScore}', strike_count = '0', frame_score = '${bowlScore}', frame_${currentFrame} = '${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      } else if (bowlTry == 2) {
        if (lastFrameScenario == "strike") {
          if (currentFrame == 10) {
            sql = `UPDATE games SET current_frame = '0', bowl_try = '0', strike_count = '0', frame_${lastFrame} = frame_${lastFrame}+bowl_1_score+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+bowl_1_score+'${bowlScore}'+'${bowlScore}', ongoing = '0' WHERE id = '${gameId}';`;
          } else {
            sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', frame_score = '0', strike_count = '0', last_frame_scenario = 'normal', frame_${lastFrame} = frame_${lastFrame}+bowl_1_score+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+bowl_1_score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
          }
        } else {
          sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', frame_score = '0', strike_count = '0', last_frame_scenario = 'normal', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      }
    } else if (throwScenario === "SPARE") {
      if (lastFrameScenario == "strike") {
        sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', frame_score = '0', strike_count = '0', last_frame_scenario = 'spare', frame_${lastFrame} = frame_${lastFrame}+bowl_1_score+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+bowl_1_score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
      } else {
        sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', frame_score = '0', strike_count = '0', last_frame_scenario = 'spare', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
      }
    } else if (throwScenario === "STRIKE") {
      if (lastFrameScenario == "strike") {
        if (strikeCount > 2) {
          sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', bowl_1_score = '${bowlScore}', frame_score = '0', strike_count = '${strikeCount}', frame_${beforeLastFrame} = frame_${beforeLastFrame}+'${bowlScore}', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        } else {
          sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', bowl_1_score = '${bowlScore}', frame_score = '0', strike_count = '${strikeCount}', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      } else if (lastFrameScenario == "spare") {
        sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', bowl_1_score = '${bowlScore}', frame_score = '0', last_frame_scenario = 'strike', strike_count = '${strikeCount}', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
      } else {
        sql = `UPDATE games SET current_frame = '${newCurrentFrame}', bowl_try = '1', bowl_1_score = '${bowlScore}', frame_score = '0', last_frame_scenario = 'strike', strike_count = '${strikeCount}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
      }
    } else if (throwScenario === "SPARE_LAST") {
      sql = `UPDATE games SET bowl_try = '1', bowl_1_score = '${bowlScore}', frame_score = '0', additional = '1', strike_count = '0', last_frame_scenario = 'spare', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
    } else if (throwScenario === "STRIKE_LAST") {
      if (lastFrameScenario == "strike") {
        if (strikeCount > 2) {
          sql = `UPDATE games SET bowl_try = '2', bowl_1_score = '${bowlScore}', frame_score = '0', additional = '2', strike_count = '${strikeCount}', frame_${beforeLastFrame} = frame_${beforeLastFrame}+'${bowlScore}', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        } else {
          sql = `UPDATE games SET bowl_try = '2', bowl_1_score = '${bowlScore}', frame_score = '0', additional = '2', strike_count = '${strikeCount}', frame_${lastFrame} = frame_${lastFrame}+bowl_1_score+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+bowl_1_score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      } else {
        sql = `UPDATE games SET bowl_try = '2', bowl_1_score = '${bowlScore}', frame_score = '0', additional = '2', last_frame_scenario = 'strike', strike_count = '${strikeCount}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}' WHERE id = '${gameId}';`;
      }
    } else if (throwScenario === "SPARE_ADDITIONAL") {
      sql = `UPDATE games SET current_frame = '0', bowl_try = '0', bowl_1_score = '0', frame_score = '0', additional = '0', strike_count = '0', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}', ongoing = '0' WHERE id = '${gameId}';`;
    } else if (throwScenario === "STRIKE_ADDITIONAL") {
      if (bowlTry == 1) {
        if (bowlScore == 10) {
          if (strikeCount > 2) {
            sql = `UPDATE games SET bowl_try = '2', frame_score = '0', strike_count = '${strikeCount}', frame_${beforeLastFrame} = frame_${beforeLastFrame}+'${bowlScore}', frame_${lastFrame} = frame_${lastFrame}+bowl_1_score+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+bowl_1_score+'${bowlScore}'+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
          } else {
            sql = `UPDATE games SET bowl_try = '2', frame_score = '0', strike_count = '${strikeCount}', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
          }
        } else {
          sql = `UPDATE games SET bowl_try = '2', frame_score = '0', strike_count = '0', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      }
      if (bowlTry == 2) {
        if (bowlScore == 10) {
          sql = `UPDATE games SET bowl_try = '3', frame_score = '0', strike_count = '${strikeCount}', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        } else {
          sql = `UPDATE games SET bowl_try = '3', frame_score = '0', strike_count = '0', frame_${lastFrame} = frame_${lastFrame}+'${bowlScore}', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}'+'${bowlScore}' WHERE id = '${gameId}';`;
        }
      }
      if (bowlTry == 3) {
        sql = `UPDATE games SET current_frame = '0', bowl_try = '0', bowl_1_score = '0', frame_score = '0', additional = '0', strike_count = '0', frame_${currentFrame} = frame_${currentFrame}+'${bowlScore}', score = score+'${bowlScore}', ongoing = '0' WHERE id = '${gameId}';`;
      }
    } else {
      return false;
    }
    await db.execute(sql);
  }
}

module.exports = Game;
