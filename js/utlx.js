define(['underscore','utl'], function(_, utl){
  'use strict';

  // movable vector. you can move this vector anywhere you want.
  var movableVector = {
    name: 'movableVector'
    , init: function(x, y, opts){
      validateType(x, y);

      this.x = x;
      this.y = y;
      this.prevX = x; // previous x position
      this.prevY = y; // previous y position

      if(!opts) opts = {};
      this.grabbable = (opts.grabbable) ? true : false; // whether you can grab this
      this.rad4grab = (opts.rad4grab) ? opts.rad4grab : 10; // radious where you can grab this
      this.grabbed = false; // whether you have grabbed this

      this.callbacks = [];

      return this;
    }
    , _init: function(p, opts){
      validateType(p);
      return this.init(p.x, p.y, opts);
    }

      // grab this
    , grab: function(x, y){
      validateType(x, y);
      if(utl.tri.dist(this, {x: x, y: y}) < this.rad4grab) this.grabbed = true;
      return this;
    }
    , _grab: function(p){
      validateType(p);
      return this.grab(p.x, p.y);
    }
    // release this
    , release: function(){
      this.grabbed = false;
      return this;
    }

    , pushCallbacks: function(obj, mtd, args){
      this.callbacks.push({obj: obj, mtd: mtd, args: args});
      return this;
    }

    , canMove: function(forced){
      if(!this.grabbable) return true;
      if(this.grabbed) return true;
      if(forced) return true;
      return false;
    }

    // move specified points
    , move: function(x, y, opts){
      validateType(x, y);
      // options:
      //   forced - true if not mind grabed or not
      //   nocallback - true if no callback
      if(!opts) opts = {};

      if(!this.canMove(opts.forced)) return this;

      this.prevX = this.x; this.prevY = this.y;
      this.x += x; this.y += y;

      if(!opts.nocallback){
        for(var i = 0; i < this.callbacks.length; i++){
          var callback = this.callbacks[i];
          callback.mtd.apply(callback.obj, callback.args);
        }
      }
      return this;
    }
    , _move: function(p, opts){
      validateType(p);
      return this.move(p.x, p.y, opts);
    }
    // move to the specified location
    , moveTo: function(x, y, opts){
      validateType(x, y);
      return this.move((x - this.x), (y - this.y), opts);
    }
    , _moveTo: function(p, opts){
      validateType(p);
      return this.moveTo(p.x, p.y, opts);
    }

    // get the track of moving
    , track: function(){
      return {x: this.x - this.prevX, y: this.y - this.prevY};
    }

    // get the previous location
    , prev: function(){
      return {x: this.prevX, y: this.prevY};
    }

    // get the difference (as vector) between this and another
    , _diff: function(p){
      return {x: this.x - p.x, y: this.y - p.y};
    }
    , _diffPrev: function(p){
      return {x: this.prevX - p.x, y: this.prevY - p.y};
    }
    // get the sum (as vector) of this and another
    , _sum: function(p){
      return {x: this.x + p.x, y: this.y + p.y};
    }
    , _add: function(p){
      return this._sum(p);
    }

    , dump: function(){
      return 'x='+this.x+', y='+this.y+', prevX='+this.prevX+', prevY='+this.prevY;
    }
  };

  var validateType = function(a1, a2){
    if(_.isNull(a2) || _.isUndefined(a2)){
      if(!_.isObject(a1)) throw 'Arg must be object.';
    }else{
      if(!_.isNumber(a1) || !_.isNumber(a2)) throw 'Args must be numeric.';
    }
  };

  // two anchors and points that are affected by the anchors' moving.
  var omega = {
    init: function(a1, a2, p, opts){
      this.a1 = a1;
      this.a2= a2;
      this.p = p;
      this.pPrjd = Object.create(movableVector)._init(utl.tri.prj(this.a1, this.a2, this.p));
      /*
      this.pArr = [].concat(p); // p can be one value or array
      this.pPrjdArr = [];
      for(var i = 0; i < this.pArr.length; i++){
       this.pPrjdArr = this.pPrjdArr.concat(Object.create(movableVector)._init(utl.tri.prj(this.a1, this.a2, this.pArr[i])));
      }
      */

      if(!opts) opts = {};
      this.noScaling = (opts.noScaling) ? true : false;

      this.a1.pushCallbacks(this, this.updateByAnchor1);
      this.a2.pushCallbacks(this, this.updateByAnchor2);
      this.p.pushCallbacks(this, this.updateByPoint);
      /*
      for(var i = 0; i < this.pArr.length; i++){
        this.pArr[i].pushCallbacks(this, 'updateByPoint');
      }
      */

      return this;
    }
    //, updateByAnchor1: function(point){
      //this.updateByAnchor(this.a2, this.a1, point);
    , updateByAnchor1: function(){
      this.updateByAnchor(this.a2, this.a1);
    }
    //, updateByAnchor2: function(point){
      //this.updateByAnchor(this.a1, this.a2, point);
    , updateByAnchor2: function(){
      this.updateByAnchor(this.a1, this.a2);
    }
    //, updateByAnchor: function(anchorStayed, anchorMoved, point){
    , updateByAnchor: function(anchorStayed, anchorMoved){
      var previousAnchorStayedToAnchorMoved = anchorMoved._diffPrev(anchorStayed);
      var currentAnchorStayedToAnchorMoved = anchorMoved._diff(anchorStayed);
      var propotionChanged = utl.tri.mag(currentAnchorStayedToAnchorMoved) / utl.tri.mag(previousAnchorStayedToAnchorMoved);
      var angleChanged = utl.tri.ang(previousAnchorStayedToAnchorMoved, currentAnchorStayedToAnchorMoved);

      var anchorStayedToPoint = this.p._diff(anchorStayed);
      anchorStayedToPoint = utl.tri.mv(anchorStayedToPoint, angleChanged);
      anchorStayedToPoint = utl.tri.mult(anchorStayedToPoint, propotionChanged);
      var newPoint = anchorStayed._add(anchorStayedToPoint);

      this.p._moveTo(newPoint, {forced: true, nocallback: true});
      this.pPrjd._moveTo(utl.tri.prj(this.a1, this.a2, this.p));

      if(this.noScaling){
        var previousProjectedToPoint = this.p._diffPrev(this.pPrjd.prev());
        var projectedToPoint = this.p._diff(this.pPrjd);
        var propotion = utl.tri.mag(previousProjectedToPoint) / utl.tri.mag(projectedToPoint);
        projectedToPoint = utl.tri.mult(projectedToPoint, propotion);
        var newPoint = this.pPrjd._add(projectedToPoint);
        this.p._moveTo(newPoint, {forced: true, nocallback: true});
        this.pPrjd._moveTo(utl.tri.prj(this.a1, this.a2, this.p));
      }
    }
    , updateByPoint: function(){
      this.pPrjd._moveTo(utl.tri.prj(this.a1, this.a2, this.p));
    }
    , addPoint: function(){

    }
  };

  var factory = {
    newMovableVector: function(x, y){
      return Object.create(movableVector).init(x, y);
    }
    , newGrabableVector: function(x, y){
      return Object.create(movableVector).init(x, y, {grabbable: true});
    }
    , newOmega: function(a1, a2, p){
      return Object.create(omega).init(a1, a2, p, {noScaling: true});
    }
  };

  return {
    fac: factory
  };
});