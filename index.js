const core = require('@actions/core');
const util = require('./util');

(async () => {
  try {

    // get the code owners
    const codeownerPath = util.getCodeOwnersPath(core.getInput('owners_location'));
    const owners = await util.loadOwners(codeownerPath);
    // remove the `@` to compare to author
    const cleanedOwners = util.cleanCodeOwners(owners);

    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
