'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fragment = "\r\nin vec2 vTextureCoord;\r\n\r\nout vec4 finalColor;\r\n\r\nuniform float uAlpha;\r\nuniform sampler2D uTexture;\r\n\r\nvoid main()\r\n{\r\n    finalColor =  texture(uTexture, vTextureCoord) * uAlpha;\r\n}\r\n";

exports.default = fragment;
//# sourceMappingURL=alpha.frag.js.map
