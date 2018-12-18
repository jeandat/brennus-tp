var pkg = require('./package.json');

module.exports = {
    // Documentation for GitBook is stored under "docs"
    root: './docs',
    title: pkg.name,
    variables: {
        version: pkg.version
    }
};
