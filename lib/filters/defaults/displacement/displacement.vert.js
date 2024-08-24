'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vertex = "in vec2 aPosition;\r\nout vec2 vTextureCoord;\r\nout vec2 vFilterUv;\r\n\r\n\r\nuniform vec4 uInputSize;\r\nuniform vec4 uOutputFrame;\r\nuniform vec4 uOutputTexture;\r\n\r\nuniform mat3 uFilterMatrix;\r\n\r\nvec4 filterVertexPosition( void )\r\n{\r\n    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;\r\n    \r\n    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;\r\n    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;\r\n\r\n    return vec4(position, 0.0, 1.0);\r\n}\r\n\r\nvec2 filterTextureCoord( void )\r\n{\r\n    return aPosition * (uOutputFrame.zw * uInputSize.zw);\r\n}\r\n\r\nvec2 getFilterCoord( void )\r\n{\r\n  return ( uFilterMatrix * vec3( filterTextureCoord(), 1.0)  ).xy;\r\n}\r\n\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = filterVertexPosition();\r\n    vTextureCoord = filterTextureCoord();\r\n    vFilterUv = getFilterCoord();\r\n}\r\n";

exports.default = vertex;
//# sourceMappingURL=displacement.vert.js.map
