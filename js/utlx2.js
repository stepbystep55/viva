define(['underscore', 'utl'], function(_, utl){
  'use strict';

  /*
   * movable vector. you can move this vector anywhere you want.
   */
  var movable = {
    name: 'movable'
    , init: function(x, y){ // you can call this as 'init(p)'
      var args = this.translateArgs(x, y);

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

  /*
   * grabbable vector. you can grab & move this vector anywhere you want.
   */
  var grabbable = {
    name: 'grabbable'
  };
  // extends movable
  for(var key in movable){
    if(key === 'init'){
      grabbable.init = function(x, y, opts){ // you can call this as 'init(p, opts)'
        var args = movable.translateArgs(x, y, opts);
        if(!args.opts) args.opts = {};
        this.rad4grab = args.opts.rad4grab || 10; // radious where you  can grab this
        this.grabbed = false; // whether you have grabbed this
        movable.init.call(this, args.x, args.y, args.opts);
        return this;
      };
    }else if(key === 'move'){
      grabbable.move = function(x, y, opts){
        // options:
        //   forced - true if not mind grabed or not
        var args = movable.translateArgs(x, y, opts);
        if(!this.canMove(args.opts.forced)) return this;
        movable.move.call(this, args.x, args.y, args.opts);
        return this;
      };
    }else{
      grabbable[key] = movable[key];
    }
  }
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

  /*
   * an grabbable center with grabbable satellites.
   * the center's moving affects satellites but satellites' moving doesn't affect others.
   */
  var spark = {
    name: 'spark'
  };
  // extends movable
  for(var key in grabbable){
    if(key === 'init'){
      spark.init = function(x, y, opts){
        var args = grabbable.translateArgs(x, y, opts);
        grabbable.init.call(this, args.x, args.y, args.opts);
        this.points = [];
        return this;
      };
    }else if(key === 'move'){
      spark.move = function(x, y, opts){
        // options:
        //   alone - true if not move points
        var args = grabbable.translateArgs(x, y, opts);
        if(!this.canMove(args.opts.forced)) return this;
        grabbable.move.call(this, args.x, args.y, args.opts);
        if(!opts.alone){
          for(var i = 0; i < this.points.length; i++) this.points[i].move(this.track(), {forced: true});
        }
        return this;
      };
      /*
    }else if(key === 'grab'){
      spark.grab = function(x, y){
        var args = this.translateArgs(x, y);
        grabbable.grab.call(this, args.x, args.y);
        for(var i = 0; i < this.points.length; i++) this.points[i].grab(args.x, args.y);
        return this;
      };
      */
    }else if(key === 'release'){
      spark.release = function(){
        grabbable.release.call(this);
        for(var i = 0; i < this.points.length; i++) this.points[i].release();
        return this;
      };
    }else{
      spark[key] = grabbable[key];
    }
  }
  spark.addPoint = function(x, y){
    var args = this.translateArgs(x, y);
    this.points.push(Object.create(grabbable).init(args.x, args.y));
    return this;
  };
  spark.addPoints = function(pArr){
    if(!_.isArray(pArr)) pArr = [pArr]; // pArr can be one value
    for(var i = 0; i < pArr.length; i++) this.points.push(pArr[i]);
    return this;
  };
  spark.update = function(x, y){
    var args = this.translateArgs(x, y);
    this.moveTo(args.x, args.y);
    for(var i = 0; i < this.points.length; i++) this.points[i].moveTo(args.x, args.y);
    return this;
  };
  spark.grabPoints = function(x, y){
    var args = this.translateArgs(x, y);
    for(var i = 0; i < this.points.length; i++) this.points[i].grab(args.x, args.y);
    return this;
  };

  // two anchors and points that are affected by the anchors' moving.
  var omega = {
    init: function(a1, a2, opts){
      // a1 & a2 & points must be grabbable.
      this.a1 = a1;
      this.a2= a2;
      this.points = [];
      if(!opts) opts = {};
      this.noScaling = opts.noScaling || false;

      this.a1.pushCallbacks(this, this.respondForAnchor1);
      this.a2.pushCallbacks(this, this.respondForAnchor2);

      return this;
    }
    , addPoints: function(pArr){
      if(!_.isArray(pArr)) pArr = [pArr]; // pArr can be one value
      for(var i = 0; i < pArr.length; i++){
        pArr[i].projected = Object.create(movable).init(utl.tri.prj(this.a1, this.a2, pArr[i]));
        pArr[i].pushCallbacks(this, this.respondForPoint, [pArr[i]]);
        if(pArr[i].points){
          for(var k = 0; k < pArr[i].points.length; k++){
            pArr[i].points[k].projected = Object.create(movable).init(utl.tri.prj(this.a1, this.a2, pArr[i].points[k]));
          }
        }
        this.points.push(pArr[i]);
      }
      return this;
    }
    , respondForAnchor1: function(){
      this.respondForAnchor(this.a2, this.a1);
    }
    , respondForAnchor2: function(){
      this.respondForAnchor(this.a1, this.a2);
    }
    , respondForAnchor: function(anchorStayed, anchorMoved){
      var previousAnchorStayedToAnchorMoved = anchorMoved.diffPrev(anchorStayed);
      var currentAnchorStayedToAnchorMoved = anchorMoved.diff(anchorStayed);
      var propotionChanged = utl.tri.mag(currentAnchorStayedToAnchorMoved) / utl.tri.mag(previousAnchorStayedToAnchorMoved);
      var angleChanged = utl.tri.ang(previousAnchorStayedToAnchorMoved, currentAnchorStayedToAnchorMoved);

      for(var i = 0; i < this.points.length; i++){
        this._movePoint(this.points[i], anchorStayed, propotionChanged, angleChanged);
        if(this.points[i].points){
          for(var k = 0; k < this.points[i].points.length; k++){
            this._movePoint(this.points[i].points[k], anchorStayed, propotionChanged, angleChanged);
          }
        }
      }
    }
    , _movePoint: function(point, anchorStayed, propotionChanged, angleChanged){
      var anchorStayedToPoint = point.diff(anchorStayed);
      anchorStayedToPoint = utl.tri.mv(anchorStayedToPoint, angleChanged);
      anchorStayedToPoint = utl.tri.mult(anchorStayedToPoint, propotionChanged);
      var newPoint = anchorStayed.add(anchorStayedToPoint);

      point.moveTo(newPoint, {forced: true, nocallback: true, alone: true});
      if(point.projected) point.projected.moveTo(utl.tri.prj(this.a1, this.a2, point));

      if(this.noScaling){
        var previousProjectedToPoint = point.diffPrev(point.projected.prev());
        var projectedToPoint = point.diff(point.projected);
        var propotion = utl.tri.mag(previousProjectedToPoint) / utl.tri.mag(projectedToPoint);
        projectedToPoint = utl.tri.mult(projectedToPoint, propotion);
        var newPoint = point.projected.add(projectedToPoint);
        point.moveTo(newPoint, {forced: true, nocallback: true, alone: true});
        point.projected.moveTo(utl.tri.prj(this.a1, this.a2, point));
      }
    }
    , respondForPoint: function(p){
      p.projected.moveTo(utl.tri.prj(this.a1, this.a2, p));
      if(p.points){
        for(var i = 0; i < p.points.length; i++) p.points[i].projected.moveTo(utl.tri.prj(this.a1, this.a2, p.points[i]));
      }
    }

    , grab: function(x, y){
      return this.grabAnchors(x, y).grabPoints(x, y);
    }
    , grabAnchors: function(x, y){
      this.a1.grab(x, y);
      this.a2.grab(x, y);
      return this;
    }
    , grabPoints: function(x, y){
      for(var i = 0; i < this.points.length; i++) this.points[i].grab(x, y);
      return this;
    }
    , release: function(){
      this.a1.release();
      this.a2.release();
      for(var i = 0; i < this.points.length; i++) this.points[i].release();
      return this;
    }
    , update: function(x, y){
      this.a1.moveTo(x, y);
      this.a2.moveTo(x, y);
      for(var i = 0; i < this.points.length; i++) this.points[i].moveTo(x, y);
      return this;
    }
  };

  var factory = {
    newMovable: function(x, y){
      return Object.create(movable).init(x, y);
    }
    , newGrabbable: function(x, y, opts){
      return Object.create(grabbable).init(x, y, opts);
    }
    , newSpark: function(x, y, opts){
      return Object.create(spark).init(x, y, opts);
    }
    , newOmega: function(a1, a2){
      return Object.create(omega).init(a1, a2, {noScaling: true});
    }
  };

  return {
    fac: factory
  };
});