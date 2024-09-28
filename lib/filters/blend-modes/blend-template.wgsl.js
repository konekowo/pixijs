'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var blendTemplate = "\r\nstruct GlobalFilterUniforms {\r\n  uInputSize:vec4<f32>,\r\n  uInputPixel:vec4<f32>,\r\n  uInputClamp:vec4<f32>,\r\n  uOutputFrame:vec4<f32>,\r\n  uGlobalFrame:vec4<f32>,\r\n  uOutputTexture:vec4<f32>,\r\n};\r\n\r\nstruct BlendUniforms {\r\n  uBlend:f32,\r\n};\r\n\r\n@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;\r\n@group(0) @binding(1) var uTexture: texture_2d<f32>;\r\n@group(0) @binding(2) var uSampler : sampler;\r\n@group(0) @binding(3) var uBackTexture: texture_2d<f32>;\r\n\r\n@group(1) @binding(0) var<uniform> blendUniforms : BlendUniforms;\r\n\r\n\r\nstruct VSOutput {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv : vec2<f32>\r\n  };\r\n\r\nfn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>\r\n{\r\n    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;\r\n\r\n    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;\r\n    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;\r\n\r\n    return vec4(position, 0.0, 1.0);\r\n}\r\n\r\nfn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\r\n{\r\n    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);\r\n}\r\n\r\nfn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\r\n{\r\n  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  \r\n}\r\n  \r\n@vertex\r\nfn mainVertex(\r\n  @location(0) aPosition : vec2<f32>, \r\n) -> VSOutput {\r\n  return VSOutput(\r\n   filterVertexPosition(aPosition),\r\n   filterTextureCoord(aPosition)\r\n  );\r\n}\r\n\r\n{FUNCTIONS}\r\n\r\n@fragment\r\nfn mainFragment(\r\n  @location(0) uv: vec2<f32>\r\n) -> @location(0) vec4<f32> {\r\n\r\n\r\n   var back =  textureSample(uBackTexture, uSampler, uv);\r\n   var front = textureSample(uTexture, uSampler, uv);\r\n   var blendedAlpha = front.a + back.a * (1.0 - front.a);\r\n   \r\n   var out = vec4<f32>(0.0,0.0,0.0,0.0);\r\n\r\n   {MAIN}\r\n\r\n   return out;\r\n}";

exports.default = blendTemplate;
//# sourceMappingURL=blend-template.wgsl.js.map