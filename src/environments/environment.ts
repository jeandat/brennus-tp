
export const environment = {
    production:true,
    mocks:false,
    baseName:'',
    api:'/api',
    apiUrl:'/api'
};

// if api is an absolute path, we take it. If relative, we construct dynamically an absolute path.
if (!environment.apiUrl.startsWith('http')) {
    environment.apiUrl = `${location.origin}${environment.baseName}${environment.api}`;
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

