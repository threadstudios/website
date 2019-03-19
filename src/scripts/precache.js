require("dotenv").config();

const fs = require("fs");
const { fetch } = require("../contentful");

console.log("Fetching content");

const precache = async () => {
  const data = await fetch("page");
  fs.writeFileSync(
    `${__dirname}/../../content/cache.json`,
    JSON.stringify(data)
  );
  console.log("Written Content");
};

precache();
