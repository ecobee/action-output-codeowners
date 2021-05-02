# contributor-labeler
Github action to return the list of owners in CODEOWNERS file

## Inputs

### `path`

The location for codeowners file, Alternative location for the CODEOWNERS file
    
## Outputs

### `owers`

Array of the owners from the CODEOWNERS file in the repository

## Example usage (add a label if the PR author isn't in CODEOWNERS)

- name: Contributor Labeler Action
  uses: ./ # Uses an action in the root directory
  id: labeler
  with:
    path: "contributor-labeler"
    
- name: Add Label
  # if the list of codeowners doesn't contain the PR author add the label
  if: ${{ contains(steps.labeler.outputs.owners, github.actor) == false }}
  uses: actions-ecosystem/action-add-labels@v1
  with:
    labels: contributor
    github_token: "${{ secrets.GITHUB_TOKEN }}"

...
