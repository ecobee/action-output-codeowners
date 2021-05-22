const core = require('@actions/core');
const util = require('./util');

(async () => {
  try {

    // get the code owners
    const codeownerPath = core.getInput('owners_location') || './CODEOWNERS'
    // core.debug(` codeownerPath -> ${codeownerPath}`);

    const owners = await util.loadOwners(codeownerPath);

    // remove the `@` to compare to author
    const cleanedOwners = owners.map(owner => {
      if (owner.charAt(0)) {
        owner = owner.slice(1);
      }
      return owner;
    });

    // core.debug(`cleanedOwners:${cleanedOwners}`);
    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
