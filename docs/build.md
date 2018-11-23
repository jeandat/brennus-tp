## Common tasks

### Configuring an environment

Angular default system being too limited, we are not using several `environment.<name>.ts` files.
Instead we are generating one dynamically from the command line via an npm script.

```bash
npm run configure -- <flags>
```

Known flags:

- `prod` <Boolean> Are we in production mode? Default: false.
- `mocks`: <Boolean> Are we using mocks? Default: true.
- `base-name`: <String> Which base name before the `api` string. Default: ''.
- `api`: <String> Which backend api url?. Default: '/api'. If `api` is an absolute path, we respect it.
If relative, we construct an absolute path from current url.

To set a flag to true, use the `--flag` syntax.
To set a flag to false, use the `--no-flag` syntax.

Here is an example that build for prod without mocks, a base name and the default path api:

```bash
npm run configure -- --prod --no-mocks --base-name '/brennus-tp'
```

Flags of type <String> needs to be wrapped in quotes.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
Use the `--prod` flag for a production build.

If you configure a base name, don't forget to also set it when building.

Here is an example for a production build:

```bash
npm run configure -- --prod --no-mocks --base-name '/brennus-tp' && npm run build -- --prod --base-href '/brennus-tp'
```

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

If you configure a base name, don't forget to also set it when serving:

```bash
npm run configure -- --base-name '/brennus-tp' && npm start -- --base-href '/brennus-tp'
```

From time to time, you might also want to start your development server in production mode in order to test performance and load times during development.

```bash
npm run start:prod
```

### Code scaffolding

Run `ng generate component component-name` to generate a new component.
You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Using a reverse proxy

`src/proxy.conf.js` can be used with `npm start` to bypass CORS issues. For now, it is used by default.

It can also be enabled in `angular.json`.

```json
"serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
        "browserTarget": "cybersoc-front:build",
        "proxyConfig": "src/proxy.conf.js" <-------------------------- HERE
    },
    "configurations": {
        "production": {
            "browserTarget": "cybersoc-front:build:production"
        }
    }
},
```

## Creating a new revision

Obviously, the build and tests scripts must work before releasing anything. This is enforced here.

Look at the `prerelease`, `release` and `postrelease` scripts to better understand what is going on.

```bash
npm run release --new-version <x.x.x | major | minor | patch | premajor | preminor | prepatch>
```

Using the `release` script will:

1. reinstall all dependencies from scratch to validate a clean install
2. execute unit tests with this fresh install
3. mark a release in code by bumping `package.json` and `package-lock.json` version (following SEMVER rules)
4. create a commit and tag on current branch
5. push commits and tags to origin

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
