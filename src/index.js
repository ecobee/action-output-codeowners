const core = require('@actions/core');
const lib = require('./lib');
const fs = require("fs");
const util = require("util");

(async () => {
  try {

    // get the code owners
    const codeownerPath = lib.getCodeOwnersPath(core.getInput('owners_location'));

    let readFile = util.promisify(fs.readFile);
    const owners = await lib.loadOwners(codeownerPath, readFile);
    
    // remove the `@` to compare to author
    const cleanedOwners = lib.cleanCodeOwners(owners);

    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
