const core = require('@actions/core');
const codeOwnersUtils = require('codeowners-utils');

(async () => {
  try {
    // `author` input defined in action metadata file
    const author = core.getInput('author');
    core.debug(`author:${author}`);

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

    // is author in the array?
    const inCodeOwners = cleanedOwners.includes(author)

    core.debug(`inCodeOwners:${inCodeOwners}`);
    core.setOutput("inCodeOwners", inCodeOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
