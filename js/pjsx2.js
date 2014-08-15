define(['underscore', 'jquery', 'utl', 'utlx2', 'pjs'], function(_, $, utl, utlx, $p){
  'use strict';

  var createOmega = function(a1, a2, opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
    var omega = utlx.fac.newHistogram(a1, a2, opts);
    if(opts.debug) omega.debug = true;

    omega.render = function(opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

      (opts.anchorWink) ? $p.fill(40, 40, 40) : $p.fill(0);
      $p.ellipse(this.a1.x, this.a1.y, 10, 10);
      $p.ellipse(this.a2.x, this.a2.y, 10, 10);
      $p.stroke(0, 0, 0);
      $p.line(this.a1.x, this.a1.y, this.a2.x, this.a2.y);

      if(this.debug){
        $p.textSize(8);
        $p.text('' + Math.round(this.a1.x) + ',' + Math.round(this.a1.y), this.a1.x, this.a1.y);
        $p.text('' + Math.round(this.a2.x) + ',' + Math.round(this.a2.y), this.a2.x, this.a2.y);
      }

      $p.beginShape();
      $p.vertex(this.points[0].x, this.points[0].y);
      for(var i = 1; i < this.points.length; i++){
        $p.bezierVertex(
          this.points[i-1].points[1].x
          , this.points[i-1].points[1].y
          , this.points[i].points[0].x
          , this.points[i].points[0].y
          , this.points[i].x
          , this.points[i].y
        );
      }
      $p.endShape();

      return this;
    };
    return omega;
  };

  var createClay = function(cx, cy, opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
    var clay = utlx.fac.newSunrays(cx, cy, opts);
    clay.name = 'clay';
    if(opts.debug) clay.debug = true;

    clay.render = function(opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

      (opts.centerWink) ? $p.fill(40, 40, 0) : $p.fill(0);
      $p.ellipse(this.x, this.y, 10, 10);

      (opts.pointsWink) ? $p.fill(40, 40, 0) : $p.fill(0);
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
    return clay;
  };

  var createSunrays = function(cx, cy, opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
    var sunrays = utlx.fac.newSunrays(cx, cy, opts);
    if(opts.debug) sunrays.debug = true;

    sunrays.render = function(opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

      (opts.centerWink) ? $p.fill(40, 40, 0) : $p.fill(0);
      $p.ellipse(this.x, this.y, 10, 10);

      (opts.pointsWink) ? $p.fill(40, 40, 0) : $p.fill(0);
      for(var i = 0; i < this.points.length; i++) $p.ellipse(this.points[i].x, this.points[i].y, 10, 10);
      return this;
    };
    return sunrays;
  };

  var factory = {
    newOmega: function(a1, a2, opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
      opts.noScaling = true;
      return createOmega(a1, a2, opts);
    }
    , newClay: function(cx, cy, opts){
      return createClay(cx, cy, opts);
    }
    , newSunrays: function(cx, cy, opts){
      return createSunrays(cx, cy, opts);
    }
  };

  return {
    fac: factory
  };
});
