const fs = require("fs");
const { get } = require("../helper/fetch");
const normalise = require("./normalise.ts");

const cacheData = JSON.parse(
  fs.readFileSync(`${__dirname}/../../content/cache.json`, "utf-8")
);

const cache = {
  includes: cacheData.includes || [],
  core: cacheData.core || []
};

module.exports = {
  fetch: async type => {
    const url = `${process.env.CF_URL}/spaces/${
      process.env.CF_SPACE
    }/entries?access_token=${
      process.env.CF_KEY
    }&content_type=${type}&include=5`;
    try {
      const result = await get(url);
      if (result.errors) return false;
      cache.includes = normalise.includes(result.includes);
      cache.core = result.items.map(item =>
        normalise[type](item, cache.includes)
      );
      return cache;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  debug: (req, res) => {
    res.send(cache);
  },
  preview: (req, res, next) => {
    const comp = cache.includes.find(comp => comp.id === req.params.id);
    if(comp) {
      req.content = {
        components : [{c : comp.ct, v : comp.fields}]
      };
    }
    return next();
  },
  router: (req, res, next) => {
    const page = cache.core.find(p => p.url === req.originalUrl);
    if (page) {
      req.content = page;
    }
    return next();
  },
  webhook: function (req, res) {
    if(req.get('THR') === 'A67AKBAFBACBJSAXLF') {
      console.log(process.env);
      this.fetch('page');
      return res.send({
        FETCHED : true
      });
    } else {
      return res.sendStatus(401);
    }
  }
};
