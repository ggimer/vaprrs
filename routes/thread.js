const functions = require("../functions/functions");
const db = require("../functions/database");
const express = require("express");
const router = express.Router();
module.exports = router;

// display all posts with matching threadId
router.get("/thread", async (req, res) => {
    let postId = req.query.postId;
    if (!postId) {
        postId = "";
    }
    let threadId = req.query.threadId;

    if (threadId == undefined || threadId == "" || threadId == 0) {
        console.log("Attempted to access an undefined thread. Redirecting to homepage...");
        res.redirect('/');
        return
    }

    // gets board info for render so that user can have a list of boards in the new post popup. and links to boards can have their routes
    let boardInfoSql = `SELECT *
                FROM t14_boards
                `;
    let boardInfo = await db.executeSQL(boardInfoSql);

    // get posts for selected thread
    let postsSql = `SELECT *
                FROM t14_posts NATURAL JOIN t14_users
                WHERE (threadId = ${threadId} OR postId = ${threadId}) 
                ORDER BY postId ASC
                `;
    let posts = await db.executeSQL(postsSql);

    if (posts.length == 0) {
        res.redirect("/");
        return;
    }
    posts.forEach(post => {
        post.dateTime = functions.formatDate(post.dateTime);
    });
    // formatDate(posts[0].dateTime);

    let userInfo;
    if (req.session.userId != null) {
        let userInfoSql = `SELECT * FROM t14_users WHERE userId = ${req.session.userId}`;
        userInfo = await db.executeSQL(userInfoSql);

    } else {
        let userInfoSql = `SELECT * FROM t14_users WHERE userId = 1`;
        userInfo = await db.executeSQL(userInfoSql);
    }

    res.render("thread", { "posts": posts, "boards": boardInfo, "user": userInfo[0], "postId": postId });
});