define(['underscore', 'jquery', 'utl', 'utlx', 'pjs'], function(_, $, utl, utlx, $p){
  'use strict';

  var fillDefault = function(){ $p.fill(0); };
  var fillWink = function(){ $p.fill(40, 40, 40); };

  /*
   * grabbable with render function
   */
  var grabbable = {name: 'pGrabbable'};

  for(var key in utlx.grabbable) grabbable[key] = utlx.grabbable[key];

  grabbable.update = function(opts){
    // nothing
    return this;
  };
  grabbable.render = function(opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
    (opts.anchorWink) ? fillWink() : fillDefault();
    $p.ellipse(this.x, this.y, 10, 10);

    return this;
  };


  /*
   * clay
   */
  var clay = {name: 'clay'};

  for(var key in utlx.sunrays) clay[key] = utlx.sunrays[key];

  clay.render = function(opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

    (opts.anchorWink) ? fillWink() : fillDefault();
    $p.ellipse(this.x, this.y, 10, 10);

    (opts.anchorWink) ? fillWink() : fillDefault();
    $p.beginShape();
    $p.noFill();
    $p.curveVertex(this.points[0].x, this.points[0].y);
    for(var i = 0; i < this.points.length; i++){
      $p.ellipse(this.points[i].x, this.points[i].y, 5, 5);
      $p.curveVertex(this.points[i].x, this.points[i].y);
    }
    //$p.curveVertex(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
    $p.curveVertex(this.points[0].x, this.points[0].y);
    $p.endShape();

    return this;
  };


  /*
   * sunrays with render function
   */
  var sunrays = {name: 'pSunrays'};

  for(var key in utlx.sunrays) sunrays[key] = utlx.sunrays[key];

  sunrays.render = function(opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

    (opts.anchorWink) ? fillWink() : fillDefault();
    $p.ellipse(this.x, this.y, 10, 10);

    (opts.anchorWink) ? fillWink() : fillDefault();
    for(var i = 0; i < this.points.length; i++) $p.ellipse(this.points[i].x, this.points[i].y, 10, 10);

    return this;
  };


  /*
   * omega
   */
  var omega = {name: 'omega'};

  for(var key in utlx.histogram){
    if(key === 'init'){
      omega.init = function(x, y, opts){
        if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
        utlx.histogram.init.call(this, x, y, opts);
        if(opts.bezier) this.bezier = true; // normal curve is default
        this.HANDLE_LENGTH = 30;

        return this;
      }
    }else{
      omega[key] = utlx.histogram[key];
    }
  }

  omega.addPoint = function(x, y, opts){
    var point;
    if(this.bezier){
      point = Object.create(sunrays).init(x, y, opts);
      var slope = utl.tri.sub(this.a1, this.a2, true);
      point.addPoint(x + slope.x * this.HANDLE_LENGTH, y + slope.y * this.HANDLE_LENGTH);
      point.addPoint(x - slope.x * this.HANDLE_LENGTH, y - slope.y * this.HANDLE_LENGTH);
    }else{
      point = Object.create(grabbable).init(x, y, opts);
    }
    this.addPoints(point);

    return this;
  };
  omega.render = function(opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

    (opts.anchorWink) ? fillWink() : fillDefault();
    $p.ellipse(this.a1.x, this.a1.y, 10, 10);
    $p.ellipse(this.a2.x, this.a2.y, 10, 10);
    $p.stroke(0, 0, 0);
    $p.line(this.a1.x, this.a1.y, this.a2.x, this.a2.y);

    if(this.debug){
      $p.textSize(8);
      $p.text('' + Math.round(this.a1.x) + ',' + Math.round(this.a1.y), this.a1.x, this.a1.y);
      $p.text('' + Math.round(this.a2.x) + ',' + Math.round(this.a2.y), this.a2.x, this.a2.y);
    }

    if(this.points.length < 3) return this;

    $p.beginShape();
    if(this.bezier){
      $p.vertex(this.points[0].x, this.points[0].y);
      for(var i = 1; i < this.points.length; i++){
        $p.bezierVertex(
          this.points[i-1].points[1].x , this.points[i-1].points[1].y
          , this.points[i].points[0].x , this.points[i].points[0].y
          , this.points[i].x , this.points[i].y
        );
      }
    }else{
      $p.curveVertex(this.points[0].x, this.points[0].y);
      for(var i = 1; i < this.points.length - 1; i++) $p.curveVertex(this.points[i].x, this.points[i].y);
      $p.curveVertex(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
    }
    $p.endShape();

    $p.beginShape();
      $p.vertex(this.a1.x, this.a1.y);
      for(var i = 0; i < this.points.length; i++) $p.vertex(this.points[i].x, this.points[i].y);
      $p.vertex(this.a2.x, this.a2.y);
    $p.endShape();

    return this;
  };


  var factory = {
    newOmega: function(a1, a2, opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
      opts.noScaling = true;
      return Object.create(omega).init(a1, a2, opts);
    }
    , newClay: function(cx, cy, opts){
      return Object.create(clay).init(cx, cy, opts);
    }
    , newSunrays: function(cx, cy, opts){
      return Object.create(sunrays).init(cx, cy, opts);
    }
  };

  return {
    fac: factory
  };
});
