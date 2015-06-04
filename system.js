System.config({
  "baseURL": ".",
  "paths": {
    "*": "*.js",
    "angular": "angular",
    "github:*": "jspm_packages/github/*.js"
  },
  typescriptOptions: {
    allowNonTsExtensions: true,
    emitDecoratorMetadata: true,
    declaration: false,
    noImplicitAny: false,
    typescript: require("typescript")
  }
});
