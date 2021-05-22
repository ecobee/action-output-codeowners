const fs = require("fs");
const util = require("util");
const core = require('@actions/core');

let readFile = util.promisify(fs.readFile)

async function loadOwners(path) {
	if (!path) return null
	let contents = await readFile(path, "utf-8")
	let entries = parse(contents)
	return entries
}

function parse(contents) {
  const regex = /\B\@([a-zA-Z'-_]+)/gm;
  const entries = contents.match(regex);
	return entries;
}

module.exports = {
  loadOwners
}