const replace = require('replace');
const shell   = require('shelljs');
const argv    = require('yargs-parser')(process.argv.slice(2));

// Used when invoked from the command line.
if(require.main === module){
    main();
}

module.exports = main;

///////////////////////////////////////////////////////////////

// Can be invoked from another module.
function main() {

    const defaults = {
        __PROD__:false,
        __MOCKS__:false,
        __BASENAME__:'',
        __API__:'/api'
    };

    const { prod, mocks, baseName, api } = argv;
    const inputs               = {};

    if(isSet(prod)) inputs.__PROD__ = prod;
    if(isSet(mocks)) inputs.__MOCKS__ = mocks;
    if(isSet(baseName)) inputs.__BASENAME__ = baseName;
    if(isSet(api)) inputs.__API__ = api;

    // Final conf
    const vars = Object.assign({}, defaults, inputs);

    // Clone template file so we can modify it.
    shell.cp('src/conf/environment.template.ts', 'src/environments/environment.ts');

    // Modify placeholders in clone with values
    for([key, value] of Object.entries(vars)){
        console.log(`Replacing ${key} with ${value}`);
        replace({
            regex:key,
            replacement:value,
            paths:['./src/environments/environment.ts']
        });
    }
}


function isSet(value) {
    return value != null;
}
