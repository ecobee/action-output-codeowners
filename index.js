const core = require('@actions/core');
const util = require('./util');

(async () => {
  try {

    // get the code owners
    let codeownerPath;
    if !(core.getInput('owners_location')) {
      codeownerPath = './CODEOWNERS'
      core.debug(` codeownerPath not provided, defaulting: ${codeownerPath}`);
    } else {
      codeownerPath = core.getInput('owners_location')
      core.debug(` codeownerPath provided: ${codeownerPath}`);
    }
    
//     const codeownerPath = core.getInput('owners_location') || './CODEOWNERS'
//     core.debug(` codeownerPath -> ${codeownerPath}`);

    const owners = await util.loadOwners(codeownerPath);

    // remove the `@` to compare to author
    const cleanedOwners = owners.map(owner => {
       core.debug(`owner: ${owner}`);
      if (owner.charAt(0)) {
        owner = owner.slice(1);
      }
      return owner;
    });

    core.debug(`cleanedOwners: ${cleanedOwners}`);
    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
