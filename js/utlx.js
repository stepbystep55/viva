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

    , pushCallbacks: function(methodName, obj){
      this.callbacks.push({methodName: methodName, obj: obj});
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
          callback.obj[callback.methodName].call(callback.obj, this);
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
    , diff: function(p){
      return {x: this.x - p.x, y: this.y - p.y};
    }
    , diffPrev: function(p){
      return {x: this.prevX - p.x, y: this.prevY - p.y};
    }
    // get the sum (as vector) of this and another
    , sum: function(p){
      return {x: this.x + p.x, y: this.y + p.y};
    }

    , dump: function(){
      return 'x='+this.x+', y='+this.y+', prevX='+this.prevX+', prevY='+this.prevY;
    }
  };

  var validateType = function(a1, a2){
    if(_.isNull(a2)){
      if(!_.isObject(a1)) throw 'Arg must be object.';
    }else{
      if(!_.isNumber(a1) || !_.isNumber(a2)) throw 'Args must be numeric.';
    }
  };

  // the Vector moving freely with two end points which move the vector
  var apex = {
    init: function(end1, end2, fulcrum){
      this.end1 = end1;
      this.end2 = end2;
      this.fulcrum = fulcrum;
      this.update();
    }
    , update: function(){
      this.projected = utl.tri.prj(this.end1, this.end2, this.fulcrum);
    }
  };

  var factory = {
    newMovableVector: function(x, y){
      var clone = Object.create(movableVector);
      clone.init(x, y);
      return clone;
    }
    , newGrabableVector: function(x, y){
      var clone = Object.create(movableVector);
      clone.init(x, y, {grabbable: true});
      return clone;
    }
    , newApex: function(end1, end2, fulcrum){
      var clone = Object.create(apex);
      clone.init(end1, end2, fulcrum);
      return clone;
    }
  };

  return {
    fac: factory
  };
});
