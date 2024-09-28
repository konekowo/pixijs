'use strict';

var pointInTriangle = require('../../../maths/point/pointInTriangle.js');
var Geometry = require('../../../rendering/renderers/shared/geometry/Geometry.js');
var State = require('../../../rendering/renderers/shared/state/State.js');
var Texture = require('../../../rendering/renderers/shared/texture/Texture.js');
var deprecation = require('../../../utils/logging/deprecation.js');
var View = require('../../view/View.js');
var MeshGeometry = require('./MeshGeometry.js');

"use strict";
class Mesh extends View.ViewContainer {
  constructor(...args) {
    let options = args[0];
    if (options instanceof Geometry.Geometry) {
      deprecation.deprecation(deprecation.v8_0_0, "Mesh: use new Mesh({ geometry, shader }) instead");
      options = {
        geometry: options,
        shader: args[1]
      };
      if (args[3]) {
        deprecation.deprecation(deprecation.v8_0_0, "Mesh: drawMode argument has been removed, use geometry.topology instead");
        options.geometry.topology = args[3];
      }
    }
    const { geometry, shader, texture, roundPixels, state, ...rest } = options;
    super({
      label: "Mesh",
      ...rest
    });
    this.renderPipeId = "mesh";
    /** @ignore */
    this._shader = null;
    this.allowChildren = false;
    this.shader = shader ?? null;
    this.texture = texture ?? shader?.texture ?? Texture.Texture.WHITE;
    this.state = state ?? State.State.for2d();
    this._geometry = geometry;
    this._geometry.on("update", this.onViewUpdate, this);
    this.roundPixels = roundPixels ?? false;
  }
  /** Alias for {@link scene.Mesh#shader}. */
  get material() {
    deprecation.deprecation(deprecation.v8_0_0, "mesh.material property has been removed, use mesh.shader instead");
    return this._shader;
  }
  /**
   * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
   * Can be shared between multiple Mesh objects.
   */
  set shader(value) {
    if (this._shader === value)
      return;
    this._shader = value;
    this.onViewUpdate();
  }
  get shader() {
    return this._shader;
  }
  /**
   * Includes vertex positions, face indices, colors, UVs, and
   * custom attributes within buffers, reducing the cost of passing all
   * this data to the GPU. Can be shared between multiple Mesh objects.
   */
  set geometry(value) {
    if (this._geometry === value)
      return;
    this._geometry?.off("update", this.onViewUpdate, this);
    value.on("update", this.onViewUpdate, this);
    this._geometry = value;
    this.onViewUpdate();
  }
  get geometry() {
    return this._geometry;
  }
  /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
  set texture(value) {
    value || (value = Texture.Texture.EMPTY);
    const currentTexture = this._texture;
    if (currentTexture === value)
      return;
    if (currentTexture && currentTexture.dynamic)
      currentTexture.off("update", this.onViewUpdate, this);
    if (value.dynamic)
      value.on("update", this.onViewUpdate, this);
    if (this.shader) {
      this.shader.texture = value;
    }
    this._texture = value;
    this.onViewUpdate();
  }
  get texture() {
    return this._texture;
  }
  get batched() {
    if (this._shader)
      return false;
    if ((this.state.data & 12) !== 0)
      return false;
    if (this._geometry instanceof MeshGeometry.MeshGeometry) {
      if (this._geometry.batchMode === "auto") {
        return this._geometry.positions.length / 2 <= 100;
      }
      return this._geometry.batchMode === "batch";
    }
    return false;
  }
  /**
   * The local bounds of the mesh.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._geometry.bounds;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    bounds.addBounds(this.geometry.bounds);
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const { x, y } = point;
    if (!this.bounds.containsPoint(x, y))
      return false;
    const vertices = this.geometry.getBuffer("aPosition").data;
    const step = this.geometry.topology === "triangle-strip" ? 3 : 1;
    if (this.geometry.getIndex()) {
      const indices = this.geometry.getIndex().data;
      const len = indices.length;
      for (let i = 0; i + 2 < len; i += step) {
        const ind0 = indices[i] * 2;
        const ind1 = indices[i + 1] * 2;
        const ind2 = indices[i + 2] * 2;
        if (pointInTriangle.pointInTriangle(
          x,
          y,
          vertices[ind0],
          vertices[ind0 + 1],
          vertices[ind1],
          vertices[ind1 + 1],
          vertices[ind2],
          vertices[ind2 + 1]
        )) {
          return true;
        }
      }
    } else {
      const len = vertices.length / 2;
      for (let i = 0; i + 2 < len; i += step) {
        const ind0 = i * 2;
        const ind1 = (i + 1) * 2;
        const ind2 = (i + 2) * 2;
        if (pointInTriangle.pointInTriangle(
          x,
          y,
          vertices[ind0],
          vertices[ind0 + 1],
          vertices[ind1],
          vertices[ind1 + 1],
          vertices[ind2],
          vertices[ind2 + 1]
        )) {
          return true;
        }
      }
    }
    return false;
  }
  /** @ignore */
  onViewUpdate() {
    this._didViewChangeTick++;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options) {
    super.destroy(options);
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._geometry?.off("update", this.onViewUpdate, this);
    this._texture = null;
    this._geometry = null;
    this._shader = null;
  }
}

exports.Mesh = Mesh;
//# sourceMappingURL=Mesh.js.map