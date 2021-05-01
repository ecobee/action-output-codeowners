const core = require('@actions/core');
const codeOwnersUtils = require('codeowners-utils');

async function getOwners(path) {
  // get the code owners
  const codeownerPath = path || './CODEOWNERS'
  const results = await codeOwnersUtils.loadOwners(codeownerPath);

  // remove the `@` to compare to author
  const cleanedOwners = results.map(line => {
    return line.name.substring(1);
  })
}

(async () => {
  try {
    // `author` input defined in action metadata file
    const author = core.getInput('author');
  
    owners = getOwners(core.getInput('path'));
    // is author in the array?
    const is_contributor = owners.some(line => line.name === author)

    core.setOutput("is_contributor", is_contributor);
  
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }

})();
