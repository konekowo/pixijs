'use strict';

"use strict";
const WGSL_TO_STD40_SIZE = {
  f32: 4,
  "vec2<f32>": 8,
  "vec3<f32>": 12,
  "vec4<f32>": 16,
  "mat2x2<f32>": 16 * 2,
  "mat3x3<f32>": 16 * 3,
  "mat4x4<f32>": 16 * 4
  // TODO - not essential for now but support these in the future
  // int:      4,
  // ivec2:    8,
  // ivec3:    12,
  // ivec4:    16,
  // uint:     4,
  // uvec2:    8,
  // uvec3:    12,
  // uvec4:    16,
  // bool:     4,
  // bvec2:    8,
  // bvec3:    12,
  // bvec4:    16,
  // mat2:     16 * 2,
  // mat3:     16 * 3,
  // mat4:     16 * 4,
};
function createUboElementsSTD40(uniformData) {
  const uboElements = uniformData.map((data) => ({
    data,
    offset: 0,
    size: 0
  }));
  let size = 0;
  let chunkSize = 0;
  let offset = 0;
  for (let i = 0; i < uboElements.length; i++) {
    const uboElement = uboElements[i];
    size = WGSL_TO_STD40_SIZE[uboElement.data.type];
    if (!size) {
      throw new Error(`Unknown type ${uboElement.data.type}`);
    }
    if (uboElement.data.size > 1) {
      size = Math.max(size, 16) * uboElement.data.size;
    }
    uboElement.size = size;
    if (chunkSize % size !== 0 && chunkSize < 16) {
      const lineUpValue = chunkSize % size % 16;
      chunkSize += lineUpValue;
      offset += lineUpValue;
    }
    if (chunkSize + size > 16) {
      offset = Math.ceil(offset / 16) * 16;
      uboElement.offset = offset;
      offset += size;
      chunkSize = size;
    } else {
      uboElement.offset = offset;
      chunkSize += size;
      offset += size;
    }
  }
  offset = Math.ceil(offset / 16) * 16;
  return { uboElements, size: offset };
}

exports.WGSL_TO_STD40_SIZE = WGSL_TO_STD40_SIZE;
exports.createUboElementsSTD40 = createUboElementsSTD40;
//# sourceMappingURL=createUboElementsSTD40.js.map