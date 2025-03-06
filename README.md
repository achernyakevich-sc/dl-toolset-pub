## Repositories

* `dl-toolset` - private, `master` as a base for development and releases
* `dl-toolset-pub` - public
  * `prod` - sharing scripts to public
  * `pages` - sharing LoW-Checker page

## Development

Base development on `master` branch in private `dl-toolset` repository. Use
a feature branch if necessary (naming like `feature/DEV-<issueId>` or
`fix/DEV-<issueId>`, etc.).

Changes being merged back could be release on `master` and merge either to
`pages` (LoW-Cheker page) or `prod` (scripts). After merge push target branch
to public repository (`dl-toolset-pub`).
