import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { State } from '../../renderers/shared/state/State.mjs';

"use strict";
class GlBatchAdaptor {
  constructor() {
    this._didUpload = false;
    this._tempState = State.for2d();
  }
  init(batcherPipe) {
    batcherPipe.renderer.runners.contextChange.add(this);
  }
  contextChange() {
    this._didUpload = false;
  }
  start(batchPipe, geometry, shader) {
    const renderer = batchPipe.renderer;
    renderer.shader.bind(shader, this._didUpload);
    renderer.shader.updateUniformGroup(renderer.globalUniforms.uniformGroup);
    renderer.geometry.bind(geometry, shader.glProgram);
  }
  execute(batchPipe, batch) {
    const renderer = batchPipe.renderer;
    this._didUpload = true;
    this._tempState.blendMode = batch.blendMode;
    renderer.state.set(this._tempState);
    const textures = batch.textures.textures;
    for (let i = 0; i < batch.textures.count; i++) {
      renderer.texture.bind(textures[i], i);
    }
    renderer.geometry.draw("triangle-list", batch.size, batch.start);
  }
}
/** @ignore */
GlBatchAdaptor.extension = {
  type: [
    ExtensionType.WebGLPipesAdaptor
  ],
  name: "batch"
};

export { GlBatchAdaptor };
//# sourceMappingURL=GlBatchAdaptor.mjs.map