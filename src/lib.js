const core = require('@actions/core');

async function loadOwners(path, readFile) {
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

function getCodeOwnersPath(filePath) {
  if (!filePath) {
    filePath = './CODEOWNERS';
    core.debug(` codeownerPath not provided, defaulting: ${filePath}`);
  } else {
    core.debug(` codeownerPath provided: ${filePath}`);
  }
  return filePath;
}

function cleanCodeOwners(owners) {
  const cleaned = owners.map(owner => {
    core.debug(`owner: ${owner}`);
   if (owner.charAt(0)) {
     owner = owner.slice(1);
   }
   return owner;
 });
 core.debug(`cleanedOwners: ${cleaned}}`);

 return cleaned;
}

module.exports = {
  loadOwners,
  getCodeOwnersPath,
  cleanCodeOwners
}
