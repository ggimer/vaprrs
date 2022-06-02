const functions = require("../functions/functions");
const db = require("../functions/database");
const express = require("express");
const router = express.Router();1
module.exports = router;

router.get('/', (req, res) => {
    res.redirect("/board?boardId=1");
  });

// displays posts on the selected board
router.get('/board', async (req, res) => {
    let requestedBoardId = req.query.boardId;
    if (requestedBoardId == null) {
        requestedBoardId = 1;
    }

    // gets board info for render so that user can have a list of boards in the new post popup. and links to boards can have their routes
    let boardInfoSql = `SELECT * FROM t14_boards`;
    let boardInfo = await db.executeSQL(boardInfoSql);

    // check if requestedBoardId is valid. if not, redirect to /
    let boardIsValid = false;
    boardInfo.forEach(board => {
        if (board.boardId == requestedBoardId) {
            boardIsValid = true;
        }
    });
    if (!boardIsValid) {
        res.redirect('/');
        return;
    }

    let userInfo;
    if (req.session.userId != null) {
        let userInfoSql = `SELECT * FROM t14_users WHERE userId = ${req.session.userId}`;
        userInfo = await db.executeSQL(userInfoSql);
    } else {
        let userInfoSql = `SELECT * FROM t14_users WHERE userId = 1`;
        userInfo = await db.executeSQL(userInfoSql);
    }

    // get threads for current board
    let threadsSql = `SELECT *
      FROM t14_posts NATURAL JOIN t14_users
      WHERE boardId = ${requestedBoardId} AND isThread IS TRUE
      ORDER BY postId DESC
      LIMIT 10
      `;
    let threads = await db.executeSQL(threadsSql);

    let threadIds = [];
    let threadsAndRecentPosts = [];
    threads.forEach(thread => {
        threadIds.push(thread.postId);
        let container = { thread: thread, posts: [], postCount: 0, lastPostDate: "" };
        threadsAndRecentPosts.push(container);
    });

    // get posts for current board
    if (threads.length != 0) {
        let postsSql = `SELECT *
                FROM t14_posts NATURAL JOIN t14_users
                WHERE boardId = ${requestedBoardId} AND threadId in (?)
                ORDER BY postId DESC
                `;
        let params = [threadIds];
        let posts = await db.executeSQL(postsSql, params);

        threadsAndRecentPosts.forEach(container => {
            container.lastPostDate = container.thread.dateTime;
            container.thread.dateTime = functions.formatDate(container.thread.dateTime);
            posts.forEach(post => {
                if (post.threadId == container.thread.postId) {
                    if (container.posts.length < 3 && container.thread.postId != post.postId) {

                        //check for most recent post
                        if (post.dateTime > container.lastPostDate) {
                            container.lastPostDate = post.dateTime;
                        }

                        post.dateTime = functions.formatDate(post.dateTime);
                        container.posts = [post].concat(container.posts);
                    }
                    container.postCount++;
                }
            });
        });

    }

    res.render("board", { "threadsAndRecentPosts": threadsAndRecentPosts, "boards": boardInfo, "user": userInfo[0] });
    // res.render("board", { "threadsAndRecentPosts": threadsAndRecentPosts, "boards": boardInfo, "user":{username:"chet", password:"", isAdmin:"0"} });
});