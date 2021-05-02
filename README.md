# contributor-labeler
Github action to return the list of owners in CODEOWNERS file

## Inputs

### `path`

The location for codeowners file, Alternative location for the CODEOWNERS file
    
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
