define(['underscore', 'jquery', 'utl', 'utlx3', 'pjs'], function(_, $, utl, utlx, $p){
  'use strict';

  var createOmega = function(a1, a2, opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
    var omega = utlx.fac.newOmega(a1, a2, opts);
    omega.name = 'omega';
    if(opts.debug) omega.debug = true;

    omega.render = function(){
      $p.stroke(0, 0, 0);
      $p.ellipse(this.a1.x, this.a1.y, 10, 10);
      $p.ellipse(this.a2.x, this.a2.y, 10, 10);
      $p.line(this.a1.x, this.a1.y, this.a2.x, this.a2.y);

      if(this.debug){
        $p.textSize(8);
        $p.text('' + Math.round(this.a1.x) + ',' + Math.round(this.a1.y), this.a1.x, this.a1.y);
        $p.text('' + Math.round(this.a2.x) + ',' + Math.round(this.a2.y), this.a2.x, this.a2.y);
      }

      for(var i = 0; i < this.pArr.length; i++){
        $p.ellipse(this.pArr[i].x, this.pArr[i].y, 10, 10);
        $p.ellipse(this.pArr[i].projected.x, this.pArr[i].projected.y, 5, 5);
        if(this.debug){
          $p.textSize(8);
          $p.text('' + Math.round(this.pArr[i].x) + ',' + Math.round(this.pArr[i].y), this.pArr[i].x, this.pArr[i].y);
        }
      }
      return this;
    };
    return omega;
  };

  var createSpark = function(c, opts){
    if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
    var spark = utlx.fac.newSpark(c);
    spark.name = 'spark';
    if(opts.debug) spark.debug = true;

    spark.render = function(){
      $p.stroke(0, 0, 0);
      $p.fill(0);
      $p.ellipse(this.c.x, this.c.y, 10, 10);
      $p.fill(255);
      for(var i = 0; i < this.pArr.length; i++) $p.ellipse(this.pArr[i].x, this.pArr[i].y, 10, 10);
      return this;
    };
    return spark;
  };

  var factory = {
    newOmega: function(a1, a2, opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
      opts.noScaling = true;
      return createOmega(a1, a2, opts);
    }
    , newPair: function(c, s, opts){
      return createSpark(c, opts).addPoints(s);
    }
    , newSpark: function(c, opts){
      return createSpark(c, opts);
    }
  };

  return {
    fac: factory
  };
});
