const core = require('@actions/core');
const lib = require('./lib');
const fs = require("fs");

(async () => {
  try {

    // get the code owners
    const codeownerPath = lib.getCodeOwnersPath(core.getInput('owners_location'));
    const owners = await lib.loadOwners(codeownerPath, fs);
    // remove the `@` to compare to author
    const cleanedOwners = lib.cleanCodeOwners(owners);

    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
