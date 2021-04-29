const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `author` input defined in action metadata file
  const author = core.getInput('author');
  console.log(`Hello ${author}!`);
  // forcing to true for now
  core.setOutput("is_contributor", true);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
