# project-template-nodejs
My personal template for new nodejs projects.

# Contents
This template provides the following:
* Additional ES Module support via esm
* VSCode debug launch configs and settings
* Testing via
  * Mocha - main test frame work
  * Chai - assertion library
  * Sinon - mock/spy library
  * istanbul - coverage reporter
* Linting via eslint + prettier
* An example application via Koa
* Google App Engine configuration
* A CI pipeline via github actions that does the following
  * Tests
  * Lints
  * builds (if necessary - this step is added for apps that might need to be built)
  * Deploys to Google app engine
    * Transient reviews for open PRs
    * Non-transient staging and production environments (and dev if needed)
  * Auto drafts release notes using release-drafter/release-drafter
  * Tagged versions publishes to github registry
