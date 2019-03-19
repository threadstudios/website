require("dotenv").config();

const express = require("express");
const app = express();
const content = require("./contentful");
const renderer = require("./render")(app);

const paths = require('./helper/paths');

app.use(express.static(`${paths.base}/public`));

if (process.env.APP_ENV === 'dev') {
    app.get("/debug", content.debug);
    app.get('/cf', content.webhook);
    app.get('/preview/:id', content.preview);
}

app.get("/*", content.router);

app.get("/*", (req, res, next) => {
  const page = req.content;
  if (!page) return next();
  res.render("base.njk", { data : page });
});

app.get("/*", (req, res) => {
  res.send("404");
});

// do an initial fetch
content.fetch("page");

app.listen(process.env.PORT || 3000);
