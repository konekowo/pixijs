var source = "struct GlobalFilterUniforms {\r\n  uInputSize:vec4<f32>,\r\n  uInputPixel:vec4<f32>,\r\n  uInputClamp:vec4<f32>,\r\n  uOutputFrame:vec4<f32>,\r\n  uGlobalFrame:vec4<f32>,\r\n  uOutputTexture:vec4<f32>,\r\n};\r\n\r\nstruct ColorMatrixUniforms {\r\n  uColorMatrix:array<vec4<f32>, 5>,\r\n  uAlpha:f32,\r\n};\r\n\r\n\r\n@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;\r\n@group(0) @binding(1) var uTexture: texture_2d<f32>;\r\n@group(0) @binding(2) var uSampler : sampler;\r\n@group(1) @binding(0) var<uniform> colorMatrixUniforms : ColorMatrixUniforms;\r\n\r\n\r\nstruct VSOutput {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv : vec2<f32>,\r\n  };\r\n  \r\nfn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>\r\n{\r\n    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;\r\n\r\n    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;\r\n    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;\r\n\r\n    return vec4(position, 0.0, 1.0);\r\n}\r\n\r\nfn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>\r\n{\r\n  return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);\r\n}\r\n\r\n@vertex\r\nfn mainVertex(\r\n  @location(0) aPosition : vec2<f32>, \r\n) -> VSOutput {\r\n  return VSOutput(\r\n   filterVertexPosition(aPosition),\r\n   filterTextureCoord(aPosition),\r\n  );\r\n}\r\n\r\n\r\n@fragment\r\nfn mainFragment(\r\n  @location(0) uv: vec2<f32>,\r\n) -> @location(0) vec4<f32> {\r\n\r\n\r\n  var c = textureSample(uTexture, uSampler, uv);\r\n  \r\n  if (colorMatrixUniforms.uAlpha == 0.0) {\r\n    return c;\r\n  }\r\n\r\n \r\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\r\n    if (c.a > 0.0) {\r\n      c.r /= c.a;\r\n      c.g /= c.a;\r\n      c.b /= c.a;\r\n    }\r\n\r\n    var cm = colorMatrixUniforms.uColorMatrix;\r\n\r\n\r\n    var result = vec4<f32>(0.);\r\n\r\n    result.r = (cm[0][0] * c.r);\r\n    result.r += (cm[0][1] * c.g);\r\n    result.r += (cm[0][2] * c.b);\r\n    result.r += (cm[0][3] * c.a);\r\n    result.r += cm[1][0];\r\n\r\n    result.g = (cm[1][1] * c.r);\r\n    result.g += (cm[1][2] * c.g);\r\n    result.g += (cm[1][3] * c.b);\r\n    result.g += (cm[2][0] * c.a);\r\n    result.g += cm[2][1];\r\n\r\n    result.b = (cm[2][2] * c.r);\r\n    result.b += (cm[2][3] * c.g);\r\n    result.b += (cm[3][0] * c.b);\r\n    result.b += (cm[3][1] * c.a);\r\n    result.b += cm[3][2];\r\n\r\n    result.a = (cm[3][3] * c.r);\r\n    result.a += (cm[4][0] * c.g);\r\n    result.a += (cm[4][1] * c.b);\r\n    result.a += (cm[4][2] * c.a);\r\n    result.a += cm[4][3];\r\n\r\n    var rgb = mix(c.rgb, result.rgb, colorMatrixUniforms.uAlpha);\r\n\r\n    rgb.r *= result.a;\r\n    rgb.g *= result.a;\r\n    rgb.b *= result.a;\r\n\r\n    return vec4(rgb, result.a);\r\n}";

export { source as default };
//# sourceMappingURL=colorMatrixFilter.wgsl.mjs.map