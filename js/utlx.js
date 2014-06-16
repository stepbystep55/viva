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
    if(_.isNull(a2) || _.isUndefined(a2)){
      if(!_.isObject(a1)) throw 'Arg must be object.';
    }else{
      if(!_.isNumber(a1) || !_.isNumber(a2)) throw 'Args must be numeric.';
    }
  };

  // the vector dragged freely and two end points which can move the vector
  var ballBar = {
    init: function(end1, end2, ball){
      this.end1 = end1;
      this.end2 = end2;
      this.ball = ball;
      this.projected = Object.create(movableVector)._init(utl.tri.prj(this.end1, this.end2, this.ball));

      this.end1.pushCallbacks('updateByBar', this);
      this.end2.pushCallbacks('updateByBar', this);
      this.ball.pushCallbacks('updateByBall', this);

      return this;
    }
    , updateByBar: function(){
    }
    , updateByBall: function(){
      this.projected._moveTo(utl.tri.prj(this.end1, this.end2, this.ball));
    }
  };

  var factory = {
    newMovableVector: function(x, y){
      return Object.create(movableVector).init(x, y);
    }
    , newGrabableVector: function(x, y){
      return Object.create(movableVector).init(x, y, {grabbable: true});
    }
    , newBallBar: function(end1, end2, ball){
      return Object.create(ballBar).init(end1, end2, ball);
    }
  };

  return {
    fac: factory
  };
});
