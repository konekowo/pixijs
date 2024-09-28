'use strict';

var PlaneGeometry = require('../mesh-plane/PlaneGeometry.js');
var applyProjectiveTransformationToPlane = require('./utils/applyProjectiveTransformationToPlane.js');
var compute2DProjections = require('./utils/compute2DProjections.js');

"use strict";
class PerspectivePlaneGeometry extends PlaneGeometry.PlaneGeometry {
  /**
   * @param options - Options to be applied to MeshPlane
   * @param options.width - The width of the plane
   * @param options.height - The height of the plane
   * @param options.verticesX - The amount of vertices on the x axis
   * @param options.verticesY - The amount of vertices on the y axis
   */
  constructor(options) {
    super(options);
    this._projectionMatrix = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const { width, height } = options;
    this.corners = [0, 0, width, 0, width, height, 0, height];
  }
  /**
   * Will set the corners of the quad to the given coordinates
   * Calculating the perspective so it looks correct!
   * @param x0 - x coordinate of the first corner
   * @param y0 - y coordinate of the first corner
   * @param x1 - x coordinate of the second corner
   * @param y1 - y coordinate of the second corner
   * @param x2 - x coordinate of the third corner
   * @param y2 - y coordinate of the third corner
   * @param x3 - x coordinate of the fourth corner
   * @param y3 - y coordinate of the fourth corner
   */
  setCorners(x0, y0, x1, y1, x2, y2, x3, y3) {
    const corners = this.corners;
    corners[0] = x0;
    corners[1] = y0;
    corners[2] = x1;
    corners[3] = y1;
    corners[4] = x2;
    corners[5] = y2;
    corners[6] = x3;
    corners[7] = y3;
    this.updateProjection();
  }
  /** Update the projection matrix based on the corners */
  updateProjection() {
    const { width, height } = this;
    const corners = this.corners;
    const projectionMatrix = compute2DProjections.compute2DProjection(
      this._projectionMatrix,
      0,
      0,
      // top-left source
      corners[0],
      corners[1],
      // top-left dest
      width,
      0,
      // top-right source
      corners[2],
      corners[3],
      // top-right dest
      width,
      height,
      // bottom-right source
      corners[4],
      corners[5],
      // bottom-right dest
      0,
      height,
      // bottom-left source
      corners[6],
      corners[7]
      // bottom-left dest
    );
    applyProjectiveTransformationToPlane.applyProjectiveTransformationToPlane(
      width,
      height,
      this,
      projectionMatrix
    );
  }
}

exports.PerspectivePlaneGeometry = PerspectivePlaneGeometry;
//# sourceMappingURL=PerspectivePlaneGeometry.js.map