var Vector = {
  x: 0,
  y: 0,
  set: function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
  setFromVector: function(ov) {
    this.x = ov.x;
    this.y = ov.y;
    return this;
  },
  add: function(ov) {
    this.x += ov.x;
    this.y += ov.y;
    return this;
  },
  sub: function(ov) {
    this.x -= ov.x;
    this.y -= ov.y;
    return this;
  },
  div: function(s) {
    this.x /= s;
    this.y /= s;
    return this;
  },
  distSq: function(ov) {
    return Math.pow((this.x - ov.x), 2) + Math.pow((this.y - ov.y), 2);
  }
}

var Points = {
  mPoints: [],
  sumOfPoints: Object.create(Vector).set(0,0),
  averagePoint: Object.create(Vector).set(0,0),
  medianPoint: Object.create(Vector).set(0,0),
  standardDeviation: Object.create(Vector).set(0,0),
  topMajorQuadrant: 0,
  topMinorQuadrant: 0,
  bottomMajorQuadrant: 0,
  bottomMinorQuadrant: 0,
  quadrantLength: [0, 0, 0, 0],

  mQuadrants: [ [], [], [], [] ],
  quadrantMinDistance: [Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0)],
  quadrantMaxDistance: [Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0)],
  quadrantMedian: [Object.create(Vector).set(0,0),
                   Object.create(Vector).set(0,0),
                   Object.create(Vector).set(0,0),
                   Object.create(Vector).set(0,0)],

  get: function(i) {
    return this.mPoints[i];
  },
  push: function(xy) {
    this.sumOfPoints.add(xy);
    this.mPoints.push(xy);
    this.update();
  },
  remove: function(i) {
    this.sumOfPoints.sub(xy);
    this.mPoints.splice(i, 1);
    this.update();
  },
  clear: function() {
    this.sumOfPoints.set(0,0);
    this.mPoints = [];
    this.update;
  },
  length: function() {
    return this.mPoints.length;
  },
  isEmpty: function() {
    return (this.mPoints.length < 1);
  },
  computeAverage: function() {
    var sum = Object.create(Vector).setFromVector(this.sumOfPoints);
    this.averagePoint.setFromVector(sum.div(this.mPoints.length));
  },
  computeMedian: function() {
    this.medianPoint.set(1e6, 1e6);
    for(var i=0; i<this.mPoints.length; i++) {
      if(this.averagePoint.distSq(this.mPoints[i]) < this.averagePoint.distSq(this.medianPoint)) {
        this.medianPoint.setFromVector(this.mPoints[i]);
      }
    }
  },
  computeStandardDeviation: function() {
    var variance = Object.create(Vector).set(0,0);
    for(var i=0; i<this.mPoints.length; i++) {
      var diff = Object.create(Vector).setFromVector(this.mPoints[i]);
      diff.sub(this.averagePoint);
      variance.add(Object.create(Vector).set(diff.x * diff.x, diff.y * diff.y));
    }
    variance.div(this.mPoints.length);
    this.standardDeviation.set(Math.sqrt(variance.x), Math.sqrt(variance.y));
  },
  addToQuadrant: function(v, quad) {
    this.mQuadrants[quad].push(v);
    this.quadrantLength[quad] = this.mQuadrants[quad].length;

    var thisDistance = this.averagePoint.distSq(v);
    var currentMinDistance = this.averagePoint.distSq(this.quadrantMinDistance[quad]);
    var currentMaxDistance = this.averagePoint.distSq(this.quadrantMaxDistance[quad]);

    if (thisDistance < currentMinDistance) {
      this.quadrantMinDistance[quad].setFromVector(v);
    }
    if (thisDistance > currentMaxDistance) {
      this.quadrantMaxDistance[quad].setFromVector(v);
    }
  },
  splitIntoQuadrants: function() {
    for(var i=0; i<this.mQuadrants.length; i++) {
      this.mQuadrants[i] = [];
      this.quadrantLength[i] = this.mQuadrants[i].length;
      this.quadrantMinDistance[i].set(1e6, 1e6);
      this.quadrantMaxDistance[i].setFromVector(this.averagePoint);
    }

    for(var i=0; i<this.mPoints.length; i++) {
      var v = this.mPoints[i];
      if ((v.x <= this.averagePoint.x) && (v.y <= this.averagePoint.y)) {
        this.addToQuadrant(v, 0);
      } else if ((v.x > this.averagePoint.x) && (v.y <= this.averagePoint.y)) {
        this.addToQuadrant(v, 1);
      } else if ((v.x <= this.averagePoint.x) && (v.y > this.averagePoint.y)) {
        this.addToQuadrant(v, 2);
      } else {
        this.addToQuadrant(v, 3);
      }
    }
  },
  computeQuadrantAverage: function(quad) {
    var sum = Object.create(Vector).set(0,0);
    var mQuad = this.mQuadrants[quad];
    for(var i=0; i<mQuad.length; i++) {
      sum.add(mQuad[i]);
    }
    return sum.div(mQuad.length);
  },
  computeQuadrantMedian: function(quad) {
    var median = Object.create(Vector).set(1e6, 1e6);
    var quadAvg = this.computeQuadrantAverage(quad);
    var mQuad = this.mQuadrants[quad];

    for(var i=0; i<mQuad.length; i++) {
      if(quadAvg.distSq(mQuad[i]) < quadAvg.distSq(median)) {
        median.setFromVector(mQuad[i]);
      }
    }

    this.quadrantMedian[quad].setFromVector(median);
  },
  computeAllQuadrantMedians: function() {
    for(var i=0; i<this.quadrantMedian.length; i++) {
      this.computeQuadrantMedian(i);
    }
  },

  update: function() {
    this.computeAverage();
    this.splitIntoQuadrants();
    this.computeAllQuadrantMedians();

    this.topMajorQuadrant = (this.mQuadrants[0].length > this.mQuadrants[1].length)?0:1;
    this.topMinorQuadrant = (this.topMajorQuadrant == 0)?1:0;
    this.bottomMajorQuadrant = (this.mQuadrants[2].length > this.mQuadrants[3].length)?2:3;
    this.bottomMinorQuadrant = (this.bottomMajorQuadrant == 2)?3:2;
  }
};
