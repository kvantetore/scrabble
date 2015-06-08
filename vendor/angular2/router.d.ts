/**
 * @module
 * @public
 * @description
 * Maps application URLs into application states, to support deep-linking and navigation.
 */
export { Router, RootRouter } from './src/router/router';
export { RouterOutlet } from './src/router/router_outlet';
export { RouterLink } from './src/router/router_link';
export { RouteParams } from './src/router/instruction';
export { RouteRegistry } from './src/router/route_registry';
export { BrowserLocation } from './src/router/browser_location';
export { Location } from './src/router/location';
export { Pipeline } from './src/router/pipeline';
export * from './src/router/route_config_decorator';
export declare const routerDirectives: List<any>;
export declare var routerInjectables: List<any>;
export declare var __esModule: boolean;