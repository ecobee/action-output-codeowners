const core = require('@actions/core');
const codeOwnersUtils = require('codeowners-utils');

(async () => {
  try {

    // get the code owners
    const codeownerPath = core.getInput('path') || './CODEOWNERS'
    const results = await codeOwnersUtils.loadOwners(codeownerPath);

    // remove the `@` to compare to author
    const cleanedOwners = results.map(line => {
      let owner = line.owners[0];
      if (owner.charAt(0)) {
        owner = owner.slice(1);
      }

      core.debug(`owner:${owner}`);
      return owner;
    });

    core.debug(`cleanedOwners:${cleanedOwners}`);
    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
