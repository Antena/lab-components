# Lab Components

### Install
Run `npm install`.

### Running the demo
Run `npm run start`, then go to [http://localhost:3030](http://localhost:3030) and pick a component from the left.

### Development

#### Code Style
Make sure your code style matches the standards established in this project by running `npm run lint`. Make sure you run this before pushing to this repo.

#### Building
The npm script `npm run start` builds, watches for changes and runs the demo app with a mock server.

If you need to run this tasks individually, all steps are available as individual scripts: 
`npm run clean`, `npm run watch` (or `npm run build` sans watch), `npm run run-express`

### API Documentation
Run `npm run build`, then `grunt ngdocs`, then `npm run start`. Go to [http://localhost:3030/docs](http://localhost:3030/docs).  

### Publishing to NPM
:warning: *Make sure your NPM registry is set to Antena's (you can run `npm config get registry` to check).*

#### Production version
We follow [Semantic Versioning](http://semver.org/) for this package. 
Once a pull-request has been merged to master, and you are ready to publish a new version for consumption by other apps, run:

**1)** `npm version <patch|minor|mayor>`

This will: 

  **a)** change package.json version property and 

  **b)** add a git tag.

For example, if the latest version was `1.0.8` and I just fixed a small bug, I would run `npm version patch`. This should print something like: 
`+ lab-components@0.1.9`

**2)** `git push --follow-tags`

**3)** `npm publish`

#### Development version
If you need to publish temporary versions (i.e. work in progress in a particular branch), to test with other apps, do the following:

**1)** Manually edit the version in `package.json`, and append a temporary name to the version

i.e. If I branched-off master, where latest version was `0.1.9`, and my branch is called `CV-1522`, I would change:
`"version": "0.1.9",`
for:
`"version": "0.1.9-CV-1522",`

**2)** You don't need to commit or push this change.

**3)** `npm publish --tag beta`
The beta tag is important, because consumers of this package will not get this version if the try to update to `latest`.

**4)** Change you consumer app's `package.json` to:  
`"lab-components": "0.1.9-CV-1522"`

**5)** Once you are finished with your tests, undo both `package.json`s.
