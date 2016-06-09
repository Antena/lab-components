# Lab Components

### Install
Run `npm install`.

### Running the demo
Run `npm run start`, then go to [http://localhost:3030](http://localhost:3030) and pick a component from the left.

### Development

Make sure your code style matches the standards established in this project by running `npm run lint`. Make sure you run this before pushing to this repo.

The npm script `npm run start` builds, watches for changes and runs the demo app with a mock server.

If you need to run this tasks individually, all steps are available as individual scripts: 
`npm run clean`, `npm run watch` (or `npm run build` sans watch), `npm run run-express`

### API Documentation
Run `npm run build`, then `grunt ngdocs`, then `npm run start`. Go to [http://localhost:3030/docs](http://localhost:3030/docs).  
