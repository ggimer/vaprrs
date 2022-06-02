const functions = require("../functions/functions");
const db = require("../functions/database");
const express = require("express");
const router = express.Router();
module.exports = router;


router.get('/remove', async (req, res) => {
    let postId = req.query.postId;
    let sql = `DELETE FROM t14_posts 
      WHERE postId = ${postId} OR threadId = ${postId}`;
    await db.executeSQL(sql);
  
    res.redirect('/');
  });

  
  router.get('/edit', async (req, res) => {
    let postId = req.query.postId;
    let sql = `SELECT * FROM t14_posts WHERE postId = ${postId} `;
    let postData = await db.executeSQL(sql);
  
    res.render('editpost', {"post": postData[0]});
  });

  
  router.post('/post/edit', async (req, res) => {
    let postId = req.body.postId
    let topic = req.body.topic;
    let name = req.body.name;
    let imgUrl = req.body.imgUrl;
    let text = req.body.text;
  
    let sql = `UPDATE t14_posts
      SET topic = ?, name = ?, imgUrl = ?, text = ?
      WHERE postId = ${postId}`;
    let params = [topic, name, imgUrl, text];
    await db.executeSQL(sql, params);
  
    res.redirect('/');
  })