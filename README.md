# Clinical Regex

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting started

Run `yarn` in the project directory to install dependencies.

## Main Scripts

In the project directory, you can run:

### `yarn dev`

Starts the Electron app in development mode.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Run electron-builder to package the app.

### `yarn lint`

Run the linter on the [`src`](src) directory.

`--max-warnings` is set to zero so that the CI fails on warnings (but `yarn dev` can still be run without having to address the warnings right away).

### `yarn tc`

Run the typechecker (without emitting any output files).
