import { type Adapter } from '../environment/adapter';
/**
 * This is an implementation of the {@link environment.Adapter} interface.
 * It can be used to make Pixi work in a Web Worker.
 * @memberof environment
 * @property {Function} createCanvas - Creates a canvas element of the given size using the browser's native OffscreenCanvas.
 * @property {Function} getCanvasRenderingContext2D - Returns a 2D rendering context.
 * @property {Function} getWebGLRenderingContext - Returns a WebGL rendering context.
 * @property {Function} getNavigator - Returns browsers window.navigator
 * @property {Function} getBaseUrl - Returns the current base URL of the worker, which is globalThis.location.href
 * @property {Function} getFontFaceSet - Return the font face set if available
 * @property {Function} fetch - Returns a Response object that has been fetched from the given URL.
 * @property {Function} parseXML - Returns Document object that has been parsed from the given XML string.
 * @memberof environment
 */
export declare const WebWorkerAdapter: Adapter;
