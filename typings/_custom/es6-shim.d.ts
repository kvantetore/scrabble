/**
* TypeScript declarations for shims provided by es6-shim.
*
* Iterators and Map/Set shims have not been created yet
*/

interface Array<T> {
    copyWithin: (target: number, start: number) => Array<T>;
    find: (predicate: (value: T) => boolean) => T;
    findIndex: (predicate: (value: T) => boolean) => number;
}

interface Math {
    acosh: (value: number) => number;
    asinh: (value: number) => number;
    atanh: (value: number) => number;
    cbrt: (value: number) => number;
    cosh: (value: number) => number;
    expm1: (value: number) => number;
    hypot: (value: number) => number;
    log2: (value: number) => number;
    log10: (value: number) => number;
    log1p: (value: number) => number;
    sign: (value: number) => number;
    sinh: (value: number) => number;
    tanh: (value: number) => number;
    trunc: (value: number) => number;
    imul: (value: number) => number;
    fround: (value: number) => number;
}

interface Number {
    clz: () => number;
}

interface String {
    repeat: (times: number) => string;
    endsWith: (searchStr: string) => boolean;
    contains: (searchStr: string) => boolean;
    codePointAt: (pos: number) => number;
}
