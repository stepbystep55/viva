define(['underscore', 'utl'], function(_, utl){
  'use strict';

  // movable vector. you can move this vector anywhere you want.
  var movable = {
    name: 'movable'
    , init: function(x, y, opts){ // you can call as init(p, opts)
      var args = this.translateArgs(x, y, opts);

      this.x = args.x;
      this.y = args.y;
      this.prevX = args.x; // previous x position
      this.prevY = args.y; // previous y position

      this.callbacks = [];

      return this;
    }

    , pushCallbacks: function(obj, mtd, args){
      this.callbacks.push({obj: obj, mtd: mtd, args: args});
      return this;
    }

    // move specified points
    , move: function(x, y, opts){
      var args = this.translateArgs(x, y, opts);
      // options:
      //   forced - true if not mind grabed or not
      //   nocallback - true if no callback
      if(!args.opts) args.opts = {};

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
        return {x: x, y: y, opts: opts || {}};
      }else if(typeof x === 'object'){
        return {x: x.x, y: x.y, opts: y || {}};
      }else{
        throw 'Illegal arguments: x='+x+', y='+y+', opts='+opts;
      }
    }
  };

  var createGrabbable = function(){
    var grabbable = Object.create(movable);
    grabbable.name = 'grabbable';

    grabbable.init = function(x, y, opts){ // you can call as init(p, opts)
      var args = this.translateArgs(x, y, opts);
      if(!args.opts) args.opts = {};
      this.rad4grab = args.opts.rad4grab || 10; // radious where you  can grab this
      this.grabbed = false; // whether you have grabbed this
      Object.getPrototypeOf(this).init.call(this, args.x, args.y, args.opts);
      return this;
    };
    // grab this
    grabbable.grab = function(x, y){
      var args = this.translateArgs(x, y);
      if(utl.tri.dist(this, {x: args.x, y: args.y}) < this.rad4grab) this.grabbed = true;
      return this;
    };
    // release this
    grabbable.release = function(){
      this.grabbed = false;
      return this;
    };
    grabbable.canMove = function(forced){
      if(this.grabbed) return true;
      if(forced) return true;
      return false;
    };
    grabbable.move = function(x, y, opts){
      var args = this.translateArgs(x, y, opts);
      if(!this.canMove(args.opts.forced)) return this;
      Object.getPrototypeOf(this).move.call(this, args.x, args.y, args.opts);
      return this;
    };
    return grabbable;
  };

  var spark = {
    init: function(c){
      // c & pArr must be grabbable.
      this.c = c; // center
      this.pArr = [];

      this.c.pushCallbacks(this, this._update);

      return this;
    }
    , addPoints: function(pArr){
      if(!_.isArray(pArr)) pArr = [pArr]; // pArr can be one value
      for(var i = 0; i < pArr.length; i++) this.pArr.push(pArr[i]);
      return this;
    }
    , _update: function(){
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].move(this.c.track(), {forced: true});
      return this;
    }

    , update: function(x, y){
      this.c.moveTo(x, y);
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].moveTo(x, y);
      return this;
    }
    , grab: function(x, y){
      this.c.grab(x, y);
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].grab(x, y);
      return this;
    }
    , release: function(){
      this.c.release();
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].release();
      return this;
    }
  };

  // two anchors and points that are affected by the anchors' moving.
  var omega = {
    init: function(a1, a2, opts){
      // a1 & a2 & pArr must be grabbable.
      this.a1 = a1;
      this.a2= a2;
      this.pArr = [];
      if(!opts) opts = {};
      this.noScaling = opts.noScaling || false;

      this.a1.pushCallbacks(this, this._updateByAnchor1);
      this.a2.pushCallbacks(this, this._updateByAnchor2);

      return this;
    }
    , addPoints: function(pArr){
      if(!_.isArray(pArr)) pArr = [pArr]; // pArr can be one value
      for(var i = 0; i < pArr.length; i++){
        pArr[i].projected = Object.create(movable).init(utl.tri.prj(this.a1, this.a2, pArr[i]));
        pArr[i].pushCallbacks(this, this._updateByPoint, [pArr[i]]);
        this.pArr.push(pArr[i]);
      }
      return this;
    }
    , _updateByAnchor1: function(){
      this._updateByAnchor(this.a2, this.a1);
    }
    , _updateByAnchor2: function(){
      this._updateByAnchor(this.a1, this.a2);
    }
    , _updateByAnchor: function(anchorStayed, anchorMoved){
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
    , _updateByPoint: function(p){
      p.projected.moveTo(utl.tri.prj(this.a1, this.a2, p));
    }

    , grab: function(x, y){
      this.a1.grab(x, y);
      this.a2.grab(x, y);
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].grab(x, y);
      return this;
    }
    , release: function(){
      this.a1.release();
      this.a2.release();
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].release();
      return this;
    }
    , update: function(x, y){
      this.a1.moveTo(x, y);
      this.a2.moveTo(x, y);
      for(var i = 0; i < this.pArr.length; i++) this.pArr[i].moveTo(x, y);
      return this;
    }
  };

  var factory = {
    newMovable: function(x, y){
      return Object.create(movable).init(x, y);
    }
    , newGrabbable: function(x, y){
      return createGrabbable().init(x, y, {grabbable: true});
    }
    , newSpark: function(c){
      return Object.create(spark).init(c);
    }
    , newOmega: function(a1, a2){
      return Object.create(omega).init(a1, a2, {noScaling: true});
    }
  };

  return {
    fac: factory
  };
});