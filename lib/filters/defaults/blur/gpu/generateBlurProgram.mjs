import { GpuProgram } from '../../../../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { GAUSSIAN_VALUES } from '../const.mjs';
import source from './blur-template.wgsl.mjs';

"use strict";
function generateBlurProgram(horizontal, kernelSize) {
  const kernel = GAUSSIAN_VALUES[kernelSize];
  const halfLength = kernel.length;
  const blurStructSource = [];
  const blurOutSource = [];
  const blurSamplingSource = [];
  for (let i = 0; i < kernelSize; i++) {
    blurStructSource[i] = `@location(${i}) offset${i}: vec2<f32>,`;
    if (horizontal) {
      blurOutSource[i] = `filteredCord + vec2(${i - halfLength + 1} * pixelStrength, 0.0),`;
    } else {
      blurOutSource[i] = `filteredCord + vec2(0.0, ${i - halfLength + 1} * pixelStrength),`;
    }
    const kernelIndex = i < halfLength ? i : kernelSize - i - 1;
    const kernelValue = kernel[kernelIndex].toString();
    blurSamplingSource[i] = `finalColor += textureSample(uTexture, uSampler, offset${i}) * ${kernelValue};`;
  }
  const blurStruct = blurStructSource.join("\n");
  const blurOut = blurOutSource.join("\n");
  const blurSampling = blurSamplingSource.join("\n");
  const finalSource = source.replace("%blur-struct%", blurStruct).replace("%blur-vertex-out%", blurOut).replace("%blur-fragment-in%", blurStruct).replace("%blur-sampling%", blurSampling).replace("%dimension%", horizontal ? "z" : "w");
  return GpuProgram.from({
    vertex: {
      source: finalSource,
      entryPoint: "mainVertex"
    },
    fragment: {
      source: finalSource,
      entryPoint: "mainFragment"
    }
  });
}

export { generateBlurProgram };
//# sourceMappingURL=generateBlurProgram.mjs.map
