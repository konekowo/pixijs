'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vertex = "in vec2 aPosition;\r\n\r\nout vec2 vTextureCoord;\r\nout vec2 vMaskCoord;\r\n\r\n\r\nuniform vec4 uInputSize;\r\nuniform vec4 uOutputFrame;\r\nuniform vec4 uOutputTexture;\r\nuniform mat3 uFilterMatrix;\r\n\r\nvec4 filterVertexPosition(  vec2 aPosition )\r\n{\r\n    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;\r\n       \r\n    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;\r\n    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;\r\n\r\n    return vec4(position, 0.0, 1.0);\r\n}\r\n\r\nvec2 filterTextureCoord(  vec2 aPosition )\r\n{\r\n    return aPosition * (uOutputFrame.zw * uInputSize.zw);\r\n}\r\n\r\nvec2 getFilterCoord( vec2 aPosition )\r\n{\r\n    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;\r\n}   \r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = filterVertexPosition(aPosition);\r\n    vTextureCoord = filterTextureCoord(aPosition);\r\n    vMaskCoord = getFilterCoord(aPosition);\r\n}\r\n";

exports.default = vertex;
//# sourceMappingURL=mask.vert.js.map