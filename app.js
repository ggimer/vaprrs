require('dotenv').config()
const { render } = require("ejs");
const express = require("express");
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const fetch = require('node-fetch');
const app = express();

global.posts = [] // this will store all posts in memory rather than querying the database all the time

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set('trust proxy', 1); // trust first proxy

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
}));

//routes **MUST BE AFTER ALL MIDDLEWARE**
[
  "board",
  "user",
  "thread",
  "admin",
  "post",

].forEach((route) => {
  console.log("loading route: " + route);
  app.use(require("./routes/" + route));
})
//start server
app.listen(3000, () => {
  console.log("Expresss server running...");
});
