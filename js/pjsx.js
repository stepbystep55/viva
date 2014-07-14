define(['jquery', 'utlx', 'pjs'], function($, utlx, pjs){
  'use strict';

  var omega = {
    init: function(a1, a2, opts){
      this.spine = utlx.fac.newOmega(a1, a2, opts);
      return this;
    }
    , addPoints: function(pArr){
      this.spine.addPoints(pArr);
      return this;
    }
    , grab: function(){
      this.spine.a1.grab(pjs.mouseX, pjs.mouseY);
      this.spine.a2.grab(pjs.mouseX, pjs.mouseY);
      for(var i = 0; i < this.spine.pArr.length; i++) this.spine.pArr[i].grab(pjs.mouseX, pjs.mouseY);
      return this;
    }
    , release: function(){
      this.spine.a1.release();
      this.spine.a2.release();
      for(var i = 0; i < this.spine.pArr.length; i++) this.spine.pArr[i].release();
      return this;
    }
    , update: function(){
      this.spine.a1.moveTo(pjs.mouseX, pjs.mouseY);
      this.spine.a2.moveTo(pjs.mouseX, pjs.mouseY);
      for(var i = 0; i < this.spine.pArr.length; i++) this.spine.pArr[i].moveTo(pjs.mouseX, pjs.mouseY);
      return this;
    }
    , render: function(){
      pjs.stroke(0, 0, 0);
      pjs.line(this.spine.a1.x, this.spine.a1.y, this.spine.a2.x, this.spine.a2.y);

      for(var i = 0; i < this.spine.pArr.length; i++){
        pjs.ellipse(this.spine.pArr[i].x, this.spine.pArr[i].y, 10, 10);
        pjs.ellipse(this.spine.pArr[i].prjd.x, this.spine.pArr[i].prjd.y, 5, 5);
      }
      return this;
    }
  };

  var factory = {
    newOmega: function(a1, a2){
      return Object.create(omega).init(a1, a2, {noScaling: true});
    }
  };

  return {
    fac: factory
  };
});
