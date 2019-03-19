const fetch = require("isomorphic-fetch");

module.exports = {
  get: async (url, params) => {
    return fetch(url, { method: "GET", ...params })
      .then(res => {
        return res.json();
      })
      .then(json => {
        return json;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
