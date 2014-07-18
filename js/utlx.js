define(['underscore','utl'], function(_, utl){
  'use strict';

  // movable vector. you can move this vector anywhere you want.
  var movableVector = {
    name: 'movableVector'
    , init: function(x, y, opts){ // you can call as init(p, opts)
      var args = this.translateArgs(x, y, opts);

      this.x = args.x;
      this.y = args.y;
      this.prevX = args.x; // previous x position
      this.prevY = args.y; // previous y position

      if(!args.opts) args.opts = {};
      this.grabbable = (args.opts.grabbable) ? true : false; // whether you can grab this
      this.rad4grab = (args.opts.rad4grab) ? args.opts.rad4grab : 10; // radious where you can grab this
      this.grabbed = false; // whether you have grabbed this

      this.callbacks = [];

      return this;
    }

      // grab this
    , grab: function(x, y){
      var args = this.translateArgs(x, y);
      if(utl.tri.dist(this, {x: args.x, y: args.y}) < this.rad4grab) this.grabbed = true;
      return this;
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
      var args = this.translateArgs(x, y, opts);
      // options:
      //   forced - true if not mind grabed or not
      //   nocallback - true if no callback
      if(!args.opts) args.opts = {};

      if(!this.canMove(args.opts.forced)) return this;

      this.prevX = this.x; this.prevY = this.y;
      this.x += args.x; this.y += args.y;

      if(!args.opts.nocallback){
        for(var i = 0; i < this.callbacks.length; i++){
          var callback = this.callbacks[i];
          callback.mtd.apply(callback.obj, callback.args);
        }
      }
      return this;
    }

    // move to the specified location
    , moveTo: function(x, y, opts){
      var args = this.translateArgs(x, y, opts);
      return this.move((args.x - this.x), (args.y - this.y), args.opts);
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
    , diff: function(p){
      return {x: this.x - p.x, y: this.y - p.y};
    }
    , diffPrev: function(p){
      return {x: this.prevX - p.x, y: this.prevY - p.y};
    }
    , add: function(p){
      return {x: this.x + p.x, y: this.y + p.y};
    }

    , translateArgs: function(x, y, opts){
      if(typeof x === 'number' && typeof y === 'number'){
        return {x: x, y: y, opts: opts};
      }else if(typeof x === 'object'){
        return {x: x.x, y: x.y, opts: y};
      }else{
        throw 'Illegal arguments: x='+x+', y='+y+', opts='+opts;
      }
    }
    , dump: function(){
      return 'x='+this.x+', y='+this.y+', prevX='+this.prevX+', prevY='+this.prevY;
    }
  };

  var star = {
    init: function(center, satellite){
      this.center = center;
      this.satellite = satellite;

      this.center.pushCallbacks(this, this.update);

      return this;
    }
    , update: function(){
      this.satellite.move(this.center.track(), {forced: true});
    }
  };

  // two anchors and points that are affected by the anchors' moving.
  var omega = {
    init: function(a1, a2, opts){
      this.a1 = a1;
      this.a2= a2;
      this.pArr = [];
      if(!opts) opts = {};
      this.noScaling = (opts.noScaling) ? true : false;

      this.a1.pushCallbacks(this, this.updateByAnchor1);
      this.a2.pushCallbacks(this, this.updateByAnchor2);

      return this;
    }
    , addPoints: function(pArr){
      if(!_.isArray(pArr)) pArr = [pArr]; // pArr can be one value
      for(var i = 0; i < pArr.length; i++){
        pArr[i].projected = Object.create(movableVector).init(utl.tri.prj(this.a1, this.a2, pArr[i]));
        pArr[i].pushCallbacks(this, this.updateByPoint, [pArr[i]]);
        this.pArr.push(pArr[i]);
      }
    }
    , updateByAnchor1: function(){
      this.updateByAnchor(this.a2, this.a1);
    }
    , updateByAnchor2: function(){
      this.updateByAnchor(this.a1, this.a2);
    }
    , updateByAnchor: function(anchorStayed, anchorMoved){
      var previousAnchorStayedToAnchorMoved = anchorMoved.diffPrev(anchorStayed);
      var currentAnchorStayedToAnchorMoved = anchorMoved.diff(anchorStayed);
      var propotionChanged = utl.tri.mag(currentAnchorStayedToAnchorMoved) / utl.tri.mag(previousAnchorStayedToAnchorMoved);
      var angleChanged = utl.tri.ang(previousAnchorStayedToAnchorMoved, currentAnchorStayedToAnchorMoved);

      for(var i = 0; i < this.pArr.length; i++){
        var anchorStayedToPoint = this.pArr[i].diff(anchorStayed);
        anchorStayedToPoint = utl.tri.mv(anchorStayedToPoint, angleChanged);
        anchorStayedToPoint = utl.tri.mult(anchorStayedToPoint, propotionChanged);
        var newPoint = anchorStayed.add(anchorStayedToPoint);

        this.pArr[i].moveTo(newPoint, {forced: true, nocallback: true});
        this.pArr[i].projected.moveTo(utl.tri.prj(this.a1, this.a2, this.pArr[i]));

        if(this.noScaling){
          var previousProjectedToPoint = this.pArr[i].diffPrev(this.pArr[i].projected.prev());
          var projectedToPoint = this.pArr[i].diff(this.pArr[i].projected);
          var propotion = utl.tri.mag(previousProjectedToPoint) / utl.tri.mag(projectedToPoint);
          projectedToPoint = utl.tri.mult(projectedToPoint, propotion);
          var newPoint = this.pArr[i].projected.add(projectedToPoint);
          this.pArr[i].moveTo(newPoint, {forced: true, nocallback: true});
          this.pArr[i].projected.moveTo(utl.tri.prj(this.a1, this.a2, this.pArr[i]));
        }
      }
    }
    , updateByPoint: function(p){
      p.projected.moveTo(utl.tri.prj(this.a1, this.a2, p));
    }
  };

  var factory = {
    newMovableVector: function(x, y){
      return Object.create(movableVector).init(x, y);
    }
    , newGrabbableVector: function(x, y){
      return Object.create(movableVector).init(x, y, {grabbable: true});
    }
    , newStar: function(c, s){
      return Object.create(star).init(c, s);
    }
    , newOmega: function(a1, a2){
      return Object.create(omega).init(a1, a2, {noScaling: true});
    }
  };

  return {
    fac: factory
  };
});