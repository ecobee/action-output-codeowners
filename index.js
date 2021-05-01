const core = require('@actions/core');
// const github = require('@actions/github');
const codeOwnersUtils = require('codeowners-utils');

(async () => {
  try {
    // `author` input defined in action metadata file
    const author = core.getInput('author');
  
    // force root path for now
    const path = ["/"]
  
    // list the code owners
    const codeownerPath = core.getInput('path') || './CODEOWNERS'
    const results = await codeOwnersUtils.loadOwners(codeownerPath);
  
    core.debug(`results: ${results[0].owners}`);

    // is author in the array?
    const is_contributor = results.some(line => line.name === author)
    core.setOutput("is_contributor", is_contributor);
  
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }

})();
