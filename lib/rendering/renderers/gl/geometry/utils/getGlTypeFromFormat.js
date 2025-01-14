'use strict';

var _const = require('../../texture/const.js');

"use strict";
const infoMap = {
  uint8x2: _const.GL_TYPES.UNSIGNED_BYTE,
  uint8x4: _const.GL_TYPES.UNSIGNED_BYTE,
  sint8x2: _const.GL_TYPES.BYTE,
  sint8x4: _const.GL_TYPES.BYTE,
  unorm8x2: _const.GL_TYPES.UNSIGNED_BYTE,
  unorm8x4: _const.GL_TYPES.UNSIGNED_BYTE,
  snorm8x2: _const.GL_TYPES.BYTE,
  snorm8x4: _const.GL_TYPES.BYTE,
  uint16x2: _const.GL_TYPES.UNSIGNED_SHORT,
  uint16x4: _const.GL_TYPES.UNSIGNED_SHORT,
  sint16x2: _const.GL_TYPES.SHORT,
  sint16x4: _const.GL_TYPES.SHORT,
  unorm16x2: _const.GL_TYPES.UNSIGNED_SHORT,
  unorm16x4: _const.GL_TYPES.UNSIGNED_SHORT,
  snorm16x2: _const.GL_TYPES.SHORT,
  snorm16x4: _const.GL_TYPES.SHORT,
  float16x2: _const.GL_TYPES.HALF_FLOAT,
  float16x4: _const.GL_TYPES.HALF_FLOAT,
  float32: _const.GL_TYPES.FLOAT,
  float32x2: _const.GL_TYPES.FLOAT,
  float32x3: _const.GL_TYPES.FLOAT,
  float32x4: _const.GL_TYPES.FLOAT,
  uint32: _const.GL_TYPES.UNSIGNED_INT,
  uint32x2: _const.GL_TYPES.UNSIGNED_INT,
  uint32x3: _const.GL_TYPES.UNSIGNED_INT,
  uint32x4: _const.GL_TYPES.UNSIGNED_INT,
  sint32: _const.GL_TYPES.INT,
  sint32x2: _const.GL_TYPES.INT,
  sint32x3: _const.GL_TYPES.INT,
  sint32x4: _const.GL_TYPES.INT
};
function getGlTypeFromFormat(format) {
  return infoMap[format] ?? infoMap.float32;
}

exports.getGlTypeFromFormat = getGlTypeFromFormat;
//# sourceMappingURL=getGlTypeFromFormat.js.map
