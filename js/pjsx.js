define(['underscore', 'jquery', 'utl', 'utlx', 'pjs'], function(_, $, utl, utlx, $p){
  'use strict';

  var omega = {
    init: function(a1, a2, opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
      if(opts.debug) this.debug = true;
      this.spine = utlx.fac.newOmega(a1, a2, opts);
      return this;
    }
    , addPoints: function(pArr){
      for(var i = 0; i < pArr.length; i++){
        var control = utl.tri.add(pArr[i], utl.tri.sub(this.spine.a2, this.spine.a1));
        pArr[i].control = utlx.fac.newGrabbableVector(control.x, control.y);
      }
      this.spine.addPoints(pArr);
      return this;
    }
    , grab: function(){
      this.spine.a1.grab($p.mouseX, $p.mouseY);
      this.spine.a2.grab($p.mouseX, $p.mouseY);
      for(var i = 0; i < this.spine.pArr.length; i++) this.spine.pArr[i].grab($p.mouseX, $p.mouseY);
      return this;
    }
    , release: function(){
      this.spine.a1.release();
      this.spine.a2.release();
      for(var i = 0; i < this.spine.pArr.length; i++) this.spine.pArr[i].release();
      return this;
    }
    , update: function(){
      this.spine.a1.moveTo($p.mouseX, $p.mouseY);
      this.spine.a2.moveTo($p.mouseX, $p.mouseY);
      for(var i = 0; i < this.spine.pArr.length; i++) this.spine.pArr[i].moveTo($p.mouseX, $p.mouseY);
      return this;
    }
    , render: function(){
      $p.stroke(0, 0, 0);
      $p.ellipse(this.spine.a1.x, this.spine.a1.y, 10, 10);
      $p.ellipse(this.spine.a2.x, this.spine.a2.y, 10, 10);
      $p.line(this.spine.a1.x, this.spine.a1.y, this.spine.a2.x, this.spine.a2.y);

      if(this.debug){
        $p.textSize(8);
        $p.text('' + Math.round(this.spine.a1.x) + ',' + Math.round(this.spine.a1.y), this.spine.a1.x, this.spine.a1.y);
        $p.text('' + Math.round(this.spine.a2.x) + ',' + Math.round(this.spine.a2.y), this.spine.a2.x, this.spine.a2.y);
      }

      for(var i = 0; i < this.spine.pArr.length; i++){
        $p.ellipse(this.spine.pArr[i].x, this.spine.pArr[i].y, 10, 10);
        $p.ellipse(this.spine.pArr[i].projected.x, this.spine.pArr[i].projected.y, 5, 5);
        $p.ellipse(this.spine.pArr[i].control.x, this.spine.pArr[i].control.y, 5, 5);
        if(this.debug){
          $p.textSize(8);
          $p.text('' + Math.round(this.spine.pArr[i].x) + ',' + Math.round(this.spine.pArr[i].y), this.spine.pArr[i].x, this.spine.pArr[i].y);
        }
      }
      return this;
    }
  };

  var star = {
    init: function(c, s, opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
      if(opts.debug) this.debug = true;
      this.spine = utlx.fac.newStar(c, s);
      return this;
    }
    , update: function(){
      this.spine.center.moveTo($p.mouseX, $p.mouseY);
      this.spine.satellite.moveTo($p.mouseX, $p.mouseY);
      return this;
    }
    , grab: function(){
      this.spine.center.grab($p.mouseX, $p.mouseY);
      this.spine.satellite.grab($p.mouseX, $p.mouseY);
      return this;
    }
    , release: function(){
      this.spine.center.release();
      this.spine.satellite.release();
      return this;
    }
    , render: function(){
      $p.stroke(0, 0, 0);
      $p.ellipse(this.spine.center.x, this.spine.center.y, 10, 10);
      $p.ellipse(this.spine.satellite.x, this.spine.satellite.y, 10, 10);
      return this;
    }
  };

  var factory = {
    newOmega: function(a1, a2, opts){
      if(_.isNull(opts) || _.isUndefined(opts)) opts = {};
      opts.noScaling = true;
      return Object.create(omega).init(a1, a2, opts);
    }
    , newStar: function(c, s, opts){
      return Object.create(star).init(c, s, opts);
    }
  };

  return {
    fac: factory
  };
});