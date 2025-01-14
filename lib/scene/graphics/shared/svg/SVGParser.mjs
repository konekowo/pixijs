import { Color } from '../../../../color/Color.mjs';
import { GraphicsPath } from '../path/GraphicsPath.mjs';

"use strict";
function SVGParser(svg, graphicsContext) {
  if (typeof svg === "string") {
    const div = document.createElement("div");
    div.innerHTML = svg.trim();
    svg = div.querySelector("svg");
  }
  const session = {
    context: graphicsContext,
    path: new GraphicsPath()
  };
  renderChildren(svg, session, null, null);
  return graphicsContext;
}
function renderChildren(svg, session, fillStyle, strokeStyle) {
  const children = svg.children;
  const { fillStyle: f1, strokeStyle: s1 } = parseStyle(svg);
  if (f1 && fillStyle) {
    fillStyle = { ...fillStyle, ...f1 };
  } else if (f1) {
    fillStyle = f1;
  }
  if (s1 && strokeStyle) {
    strokeStyle = { ...strokeStyle, ...s1 };
  } else if (s1) {
    strokeStyle = s1;
  }
  session.context.fillStyle = fillStyle;
  session.context.strokeStyle = strokeStyle;
  let x;
  let y;
  let x1;
  let y1;
  let x2;
  let y2;
  let cx;
  let cy;
  let r;
  let rx;
  let ry;
  let points;
  let pointsString;
  let d;
  let graphicsPath;
  let width;
  let height;
  switch (svg.nodeName.toLowerCase()) {
    case "path":
      d = svg.getAttribute("d");
      graphicsPath = new GraphicsPath(d);
      session.context.path(graphicsPath);
      if (fillStyle)
        session.context.fill();
      if (strokeStyle)
        session.context.stroke();
      break;
    case "circle":
      cx = parseFloatAttribute(svg, "cx", 0);
      cy = parseFloatAttribute(svg, "cy", 0);
      r = parseFloatAttribute(svg, "r", 0);
      session.context.ellipse(cx, cy, r, r);
      if (fillStyle)
        session.context.fill();
      if (strokeStyle)
        session.context.stroke();
      break;
    case "rect":
      x = parseFloatAttribute(svg, "x", 0);
      y = parseFloatAttribute(svg, "y", 0);
      width = parseFloatAttribute(svg, "width", 0);
      height = parseFloatAttribute(svg, "height", 0);
      rx = parseFloatAttribute(svg, "rx", 0);
      ry = parseFloatAttribute(svg, "ry", 0);
      if (rx || ry) {
        session.context.roundRect(x, y, width, height, rx || ry);
      } else {
        session.context.rect(x, y, width, height);
      }
      if (fillStyle)
        session.context.fill();
      if (strokeStyle)
        session.context.stroke();
      break;
    case "ellipse":
      cx = parseFloatAttribute(svg, "cx", 0);
      cy = parseFloatAttribute(svg, "cy", 0);
      rx = parseFloatAttribute(svg, "rx", 0);
      ry = parseFloatAttribute(svg, "ry", 0);
      session.context.beginPath();
      session.context.ellipse(cx, cy, rx, ry);
      if (fillStyle)
        session.context.fill();
      if (strokeStyle)
        session.context.stroke();
      break;
    case "line":
      x1 = parseFloatAttribute(svg, "x1", 0);
      y1 = parseFloatAttribute(svg, "y1", 0);
      x2 = parseFloatAttribute(svg, "x2", 0);
      y2 = parseFloatAttribute(svg, "y2", 0);
      session.context.beginPath();
      session.context.moveTo(x1, y1);
      session.context.lineTo(x2, y2);
      if (strokeStyle)
        session.context.stroke();
      break;
    case "polygon":
      pointsString = svg.getAttribute("points");
      points = pointsString.match(/\d+/g).map((n) => parseInt(n, 10));
      session.context.poly(points, true);
      if (fillStyle)
        session.context.fill();
      if (strokeStyle)
        session.context.stroke();
      break;
    case "polyline":
      pointsString = svg.getAttribute("points");
      points = pointsString.match(/\d+/g).map((n) => parseInt(n, 10));
      session.context.poly(points, false);
      if (strokeStyle)
        session.context.stroke();
      break;
    case "g":
    case "svg":
      break;
    default: {
      console.info(`[SVG parser] <${svg.nodeName}> elements unsupported`);
      break;
    }
  }
  for (let i = 0; i < children.length; i++) {
    renderChildren(children[i], session, fillStyle, strokeStyle);
  }
}
function parseFloatAttribute(svg, id, defaultValue) {
  const value = svg.getAttribute(id);
  return value ? Number(value) : defaultValue;
}
function parseStyle(svg) {
  const style = svg.getAttribute("style");
  const strokeStyle = {};
  const fillStyle = {};
  let useFill = false;
  let useStroke = false;
  if (style) {
    const styleParts = style.split(";");
    for (let i = 0; i < styleParts.length; i++) {
      const stylePart = styleParts[i];
      const [key, value] = stylePart.split(":");
      switch (key) {
        case "stroke":
          if (value !== "none") {
            strokeStyle.color = Color.shared.setValue(value).toNumber();
            useStroke = true;
          }
          break;
        case "stroke-width":
          strokeStyle.width = Number(value);
          break;
        case "fill":
          if (value !== "none") {
            useFill = true;
            fillStyle.color = Color.shared.setValue(value).toNumber();
          }
          break;
        case "fill-opacity":
          fillStyle.alpha = Number(value);
          break;
        case "stroke-opacity":
          strokeStyle.alpha = Number(value);
          break;
        case "opacity":
          fillStyle.alpha = Number(value);
          strokeStyle.alpha = Number(value);
          break;
      }
    }
  } else {
    const stroke = svg.getAttribute("stroke");
    if (stroke && stroke !== "none") {
      useStroke = true;
      strokeStyle.color = Color.shared.setValue(stroke).toNumber();
      strokeStyle.width = parseFloatAttribute(svg, "stroke-width", 1);
    }
    const fill = svg.getAttribute("fill");
    if (fill && fill !== "none") {
      useFill = true;
      fillStyle.color = Color.shared.setValue(fill).toNumber();
    }
  }
  return {
    strokeStyle: useStroke ? strokeStyle : null,
    fillStyle: useFill ? fillStyle : null
  };
}

export { SVGParser };
//# sourceMappingURL=SVGParser.mjs.map
