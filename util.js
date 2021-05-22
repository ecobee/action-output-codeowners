const fs = require("fs");
const util = require("util");
const core = require('@actions/core');

let readFile = util.promisify(fs.readFile);

async function loadOwners(path) {
  core.debug(` [loadOwners] -> path: ${path}`);
  if (!path) return null;
  
  let contents = await readFile(path, "utf-8");
  core.debug(` [loadOwners] -> contents: ${contents}`);

  let entries = parse(contents);
  core.debug(` [loadOwners] -> entries: ${entries}`);

  return entries
}

function parse(contents) {
  const regex = /\B\@([a-zA-Z'-_]+)/gm;
  const entries = contents.match(regex);
	core.debug(` [parse] -> entries: ${entries}`);

  return entries;
}

module.exports = {
  loadOwners
}
