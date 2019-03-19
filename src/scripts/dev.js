const { spawn } = require("child_process");
const path = require("path");
const Bundler = require("parcel-bundler");
const kill = require("tree-kill");

const serverBundler = new Bundler(path.join(__dirname, "../../src/server.js"), {
  target: "node",
  watch: true,
  outDir: path.join(__dirname, "../../dist/server")
});

const clientBundler = new Bundler(path.join(__dirname, "../../src/client.js"), {
  watch: true,
  outDir: path.join(__dirname, "../../public"),
  outFile: "c"
});

let bundle = null;
let child = null;

serverBundler.on("bundled", compiledBundle => {
  bundle = compiledBundle;
});

serverBundler.on("buildEnd", () => {
  if (bundle !== null) {
    if (child) {
      child.stdout.removeAllListeners("data");
      child.stderr.removeAllListeners("data");
      child.removeAllListeners("exit");
      kill(child.pid);
    }
    child = spawn("node", [bundle.name]);

    child.stdout.on("data", data => {
      process.stdout.write(data);
    });

    child.stderr.on("data", data => {
      process.stdout.write(data);
    });

    child.on("exit", code => {
      console.log(`Child process exited with code ${code}`);
      child = null;
    });
  }

  bundle = null;
});

serverBundler.bundle();
clientBundler.bundle();
