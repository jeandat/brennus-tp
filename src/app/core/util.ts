export function stringify(object:object, pretty = true):string {
    if (pretty)
        return JSON.stringify(object, null, '    ');
    else
        return JSON.stringify(object);
}

export function hash(s:string):number {
    let h = 0, char;
    if (s.length === 0) return h;
    for (let i = 0, l = s.length; i < l; i++) {
        char = s.charCodeAt(i);
        // tslint:disable:no-bitwise
        h = ((h << 5) - h) + char;
        // tslint:disable:no-bitwise
        h |= 0; // Convert to 32bit integer
    }
    return h;
}
