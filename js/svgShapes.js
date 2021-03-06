function svgEllipse(svgId, center, width, height) {
  var tEllipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  var mWidth = Math.min(width.x, width.y);
  var mHeight = Math.min(height.x, height.y);
  tEllipse.setAttributeNS(null, "cx", center.x);
  tEllipse.setAttributeNS(null, "cy", center.y);
  tEllipse.setAttributeNS(null, "rx", mWidth);
  tEllipse.setAttributeNS(null, "ry", mHeight);
  tEllipse.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tEllipse);
}

function svgCircle(svgId, center, radius) {
  svgEllipse(svgId, center, radius, radius);
}

function svgLine(svgId, p0, p1) {
  var tLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  tLine.setAttributeNS(null, "x1", p0.x);
  tLine.setAttributeNS(null, "y1", p0.y);
  tLine.setAttributeNS(null, "x2", p1.x);
  tLine.setAttributeNS(null, "y2", p1.y);
  tLine.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tLine);
}

function svgBezier(svgId, p0, p1, p2, p3, p4) {
  var tPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var d = "M"+p0.x+" "+p0.y+ " Q "+p1.x+" "+p1.y+", "+p2.x+" "+p2.y;
  d += " T "+p3.x+" "+p3.y+" T "+p4.x+" "+p4.y;
  tPath.setAttributeNS(null, "d", d);
  tPath.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tPath);
}

function svgArc(svgId, p0, p1) {
  var tPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var dist = Math.sqrt(p0.distSq(p1));
  var d = "M"+p0.x+" "+p0.y+" A "+(dist/1.5)+" "+(dist/1.8)+" "+45+" 0 0 "+p1.x+" "+p1.y;
  tPath.setAttributeNS(null, "d", d);
  tPath.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tPath);
}
