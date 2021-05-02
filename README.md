# contributor-labeler
Github action to label PRs with 'contributor' if the author isn't in the CODEOWNERS file

## Inputs
### `author`

**Required** The name of the person who authored the PR. Default `"user"`.

### `path`

The location for codeowners file, Alternative location for the CODEOWNERS file
    
## Outputs

### `isExternalContributor`

true/false

## Example usage

uses: actions/contributor-labeler@v1.1
with:
  author: some-user-name

