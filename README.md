# Web-Asset-Library

### Note :
Use node version 16.13.2, Since this version has npm(8.1.2) which works fine and later version has [issues](https://getridbug.com/node-js/unexpected-token-when-trying-to-run-npm-install/)

### Built with
* [Storybook 6.x](https://storybook.js.org/)
* [Vuetify 2.x](https://vuetifyjs.com/en/introduction/why-vuetify/)
* [Vue 2.x](https://v2.vuejs.org/)
* [Charts](https://vue-chartjs.org)

## Project setup
```
yarn install
```

### Run storybook
```
yarn storybook
```

### Compiles and hot-reloads for development of individual components 
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```
### Add New Component
Below command would help to generate a component and it's corresponding story and it allows to generate component like a generic and table components.
```
yarn add-component
```

If you are sure about the type of component to generate you can simply provide it as a parameter to the add-component command to skip some questions.
```
yarn add-component Generic
yarn add-component Table
```
## Commit messages

Commit messages must be in a standard format.

* `change-type(package): JIRA-REF, description` - use this format when making changes to packages, e.g.
    * major(button): ECCORECS-12345, breaking change
    * minor(input): ECCORECS-12345, new functionality hidden by default
    * patch(pagination): ECCORECS-12345, bug fix
    * chore(data-table): ECCORECS-12345, clean up with no change to functionality
* `Update config file` - use this message when updating a top-level file, e.g. .gitignore or .editorconfig
* `Update readme` - use this message when updating the top-level readme.md

Please note that only a single package may be updated in a commit, though multiple packages can be updated in a PR.

If you need to make follow-up changes once a PR is reviewed do one of the following:
* if you are confident using git, rewrite the history in your feature branch and update the PR to make all the changes in a single commit
* use the same or a lesser `change-type` for subsequent commits, e.g. if the main commit is `minor` a follow-up commit can be classed as `minor`, `patch` or `chore`

### Change types
Change types mostly follow the semver standard (https://semver.org/):
* `major` - a breaking change, includes changes to the UI
* `minor` - new functionality added in a backwards-compatible manner
* `patch` - a backwards-compatible bug fix
* `chore` - code clean up without any change to functionality, e.g. formatting or linting

## Deployment
Currently we have two branches
* Develop
    * Used for development 
    * When pull request is merged below job is triggered which generate the latest story book and is pushed to S3 bucket
        * https://jenkins.morningstar.com/job/IWT-GIT/job/00946-Hosting-Platform-Client-Assets-Web-Asset-Library
    * S3 bucket hosts the static resource can be access using the below url 
        * https://echost-qa.morningstar.com/web-asset-library/index.html
* Master
    * This will be the production branch
    * We will sync up with develop branch for publishing final changes.

## License
Morningstar Visualization Library is licensed under the Apache License 2.0. Details can be found in the LICENSE file.
*