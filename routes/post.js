const functions = require("../functions/functions");
const db = require("../functions/database");
const express = require("express");
const router = express.Router();
module.exports = router;


//Stores NEW POST in DB and redirects user to view the thread
router.post('/post/new', async (req, res) => {
    let boardId = req.body.boardId;
    let userId = req.body.userId;
    let threadId = req.body.threadId;
    let topic = req.body.topic;
    let name = req.body.name;
    let imgUrl = req.body.imgUrl;
    let text = req.body.text;
    let color = req.body.color;
    let isThread = 0;
    if (threadId == 0) {
      isThread = 1;
    }
  
    let sql = `INSERT INTO t14_posts
                (boardId, userId, isThread, threadId, topic, name, imgUrl, text, color, dateTime)
                VALUES (?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP)`;
  
    let params = [boardId, userId, isThread, threadId, topic, name, imgUrl, text, color];
    await db.executeSQL(sql, params);
  
    if (threadId == 0) {
      res.redirect(`/board?boardId=${boardId}`)
    }
    else {
      res.redirect(`/thread?threadId=${threadId}`)
    }
  });
  