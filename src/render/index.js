const nunjucks = require("nunjucks");
const path = require("path");
const paths = require("../helper/paths");

var ComponentTag = function(env) {
  this.tags = ["component"];

  this.parse = function(parser, nodes, lexer) {
    var token = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);
    return new nodes.CallExtension(this, "run", args);
  };

  this.run = function(context, comp) {
    env.opts.autoescape = false;
    const data = typeof comp.v === 'object' ? comp.v : { v : comp.v }
    const rendered = env.render(
      path.resolve(
        `${paths.src}/render/templates/component/${
          comp.c
        }.njk`
      ),
      data
    );
    return rendered;
  };
};

module.exports = app => {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(`${paths.src}/render/templates`, {
      noCache: true,
      watch: true
    })
  );
  env.addExtension("component", new ComponentTag(env));
  env.express(app);
};
