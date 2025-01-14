import { WGSL_ALIGN_SIZE_DATA } from './createUboElementsWGSL.mjs';

"use strict";
function generateArraySyncWGSL(uboElement, offsetToAdd) {
  const { size, align } = WGSL_ALIGN_SIZE_DATA[uboElement.data.type];
  const remainder = (align - size) / 4;
  return `
         v = uv.${uboElement.data.name};
         ${offsetToAdd !== 0 ? `offset += ${offsetToAdd};` : ""}

         arrayOffset = offset;

         t = 0;

         for(var i=0; i < ${uboElement.data.size * (size / 4)}; i++)
         {
             for(var j = 0; j < ${size / 4}; j++)
             {
                 data[arrayOffset++] = v[t++];
             }
             ${remainder !== 0 ? `arrayOffset += ${remainder};` : ""}
         }
     `;
}

export { generateArraySyncWGSL };
//# sourceMappingURL=generateArraySyncWGSL.mjs.map
