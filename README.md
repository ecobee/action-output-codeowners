# contributor-labeler
Github action to return the list of owners in CODEOWNERS file

## Inputs

### `owners_location`

Location for the CODEOWNERS file if it is not in the root of the repo
    
## Outputs

### `owers`

Array of the owners from the CODEOWNERS file in the repository

## Example usage (add a label if the PR author isn't in CODEOWNERS)

```
- name: Contributor Labeler Action
  uses: duthied/contributor-labeler@v1
  id: labeler
  with:
    path: "contributor-labeler"
    
- name: Add Label
  # if the list of codeowners doesn't contain the PR author add the label
  if: ${{ contains(steps.labeler.outputs.owners, github.actor) == false }}
  uses: duthied/action-add-labels@v1.02
  with:
    labels: contributor
    github_token: "${{ secrets.GITHUB_TOKEN }}"

```

Note: the `node_modules` directory and contents are checked in since GitHub downloads each action run in a workflow during runtime and executes it as a complete package of code before you can use workflow commands like run to interact with the runner machine. This means you must include any package dependencies required to run the JavaScript code.  See https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github

Alternatively, NCC could be used (https://github.com/vercel/ncc) but I haven't done that yet.