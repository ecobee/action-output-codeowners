import * as core from '@actions/core';
import { getCodeOwnersPath, loadOwners, cleanCodeOwners } from './lib';
import * as fs from 'fs';
import * as util from 'util';

(async () => {
  try {

    // get the code owners
    const codeownerPath = getCodeOwnersPath(core.getInput('owners_location'));

    let readFile = util.promisify(fs.readFile);
    const owners = await loadOwners(codeownerPath, readFile);
    
    // remove the `@` to compare to author
    const cleanedOwners = cleanCodeOwners(owners);

    core.setOutput("owners", cleanedOwners);
  
  } catch (error) {
    core.setFailed(error.message);
  }

})();
