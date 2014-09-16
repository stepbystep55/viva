define(['underscore', 'jquery', 'utl', 'utlx', 'pjs'], function(_, $, utl, utlx, $p){
  'use strict';

  var log = function(str){console.log(str);}

  var HANDLE_RADIUS = 10;

  /*
   * clay
   */
  var clay = {name: 'clay'};

  for(var key in utlx.sunrays) clay[key] = utlx.sunrays[key];

  clay.render = function(opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

    if(this.points.length <= 3) return this;

    $p.noFill();
    $p.beginShape();
    $p.curveVertex(this.points[0].x, this.points[0].y);
    for(var i = 0; i < this.points.length - 1; i++) $p.curveVertex(this.points[i].x, this.points[i].y);
    $p.curveVertex(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
    $p.endShape();

    return this;
  };
  clay.renderCenter = function(){
    $p.fill(0);
    $p.ellipse(this.x, this.y, HANDLE_RADIUS, HANDLE_RADIUS);
    return this;
  };
  clay.renderPoints = function(){
    $p.fill(0);
    for(var i = 0; i < this.points.length; i++) $p.ellipse(this.points[i].x, this.points[i].y, HANDLE_RADIUS, HANDLE_RADIUS);
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
        this.HANDLE_LENGTH = 30;

        return this;
      }
    }else{
      omega[key] = utlx.histogram[key];
    }
  }

  omega.render = function(opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};

    $p.stroke(0, 0, 0);
    $p.line(this.a1.x, this.a1.y, this.a2.x, this.a2.y);

    if(this.debug){
      $p.textSize(8);
      $p.text('' + Math.round(this.a1.x) + ',' + Math.round(this.a1.y), this.a1.x, this.a1.y);
      $p.text('' + Math.round(this.a2.x) + ',' + Math.round(this.a2.y), this.a2.x, this.a2.y);
    }

    if(this.points.length < 3) return this;

    $p.beginShape();
    $p.vertex(this.points[0].x, this.points[0].y);
    for(var i = 1; i < this.points.length; i++){
      $p.bezierVertex(
        this.points[i-1].points[1].x , this.points[i-1].points[1].y
        , this.points[i].points[0].x , this.points[i].points[0].y
        , this.points[i].x , this.points[i].y
      );
    }
    $p.endShape();

    return this;
  };
  omega.renderAnchors = function(){
    $p.fill(0);
    $p.ellipse(this.a1.x, this.a1.y, HANDLE_RADIUS, HANDLE_RADIUS);
    $p.ellipse(this.a2.x, this.a2.y, HANDLE_RADIUS, HANDLE_RADIUS);
    return this;
  };
  omega.renderPoints = function(){
    $p.fill(0);
    for(var i = 0; i < this.points.length; i++) $p.ellipse(this.points[i].x, this.points[i].y, HANDLE_RADIUS, HANDLE_RADIUS);
    return this;
  };
  omega.renderPointsPoints = function(){
    $p.fill(0);
    for(var i = 0; i < this.points.length; i++){
      for(var k = 0; k < this.points[i].points.length; k++){
        //if(i == 0 && k == 0) continue;
        $p.ellipse(this.points[i].points[k].x, this.points[i].points[k].y, HANDLE_RADIUS, HANDLE_RADIUS);
      }
    }
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
  };

  return {
    fac: factory
  };
});
