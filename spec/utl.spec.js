// how to execute: jasmine-node --color --runWithRequireJs --requireJsSetup spec/config.js --verbose spec
// if there is a syntax error in spec, you will get nothing when you run spec.
requirejs(['utl'], function(utl){
  describe('trigonometry#dist', function(){
    it("return distance between two points", function(){
      var p1 = {x: 0, y: 0};
      var p2 = {x: 10, y: 10};
      var distance = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
      expect(utl.tri.dist(p1, p2)).toBe(distance);
    });
  });
  describe('trigonometry#ang', function(){
    it("return angle between two points", function(){
      var p1 = {x: 10, y: 0}, p2 = {x: 10, y: 0};
      expect(utl.tri.ang(p1, p2)).toBe(0);

      p1 = {x: 10, y: 0}, p2 = {x: 10, y: 10};
      expect(utl.tri.ang(p1, p2)).toBe(Math.PI / 4);

      p1 = {x: 10, y: 0}, p2 = {x: 0, y: 10};
      expect(utl.tri.ang(p1, p2)).toBe(Math.PI / 2);

      p1 = {x: 10, y: 0}, p2 = {x: -10, y: 0};
      expect(utl.tri.ang(p1, p2)).toBe(Math.PI);

      p1 = {x: 10, y: 0}, p2 = {x: 0, y: -10};
      expect(utl.tri.ang(p1, p2)).toBe(- Math.PI / 2);
    });
  });
  describe('trigonometry#toDegree', function(){
    it("return degree of angle", function(){
      expect(Math.round(utl.tri.toDegree(Math.PI / 6))).toBe(30);
      expect(utl.tri.toDegree(Math.PI / 4)).toBe(45);
      expect(utl.tri.toDegree(Math.PI / 2)).toBe(90);
      expect(utl.tri.toDegree(Math.PI)).toBe(180);
      expect(Math.round(utl.tri.toDegree(Math.PI * 2))).toBe(360);
    });
  });
  describe('trigonometry#add', function(){
    var p1 = {x: 1, y: 3}, p2 = {x: 5, y: -7};
    it("return addition of two vectors", function(){
      var combined = utl.tri.add(p1, p2);
      expect(combined.x).toBe(p1.x + p2.x);
      expect(combined.y).toBe(p1.y + p2.y);
    });
    it("return normalized addition of two vectors", function(){
      var combined = utl.tri.add(p1, p2, true);
      expect(utl.tri.mag(combined)).toBe(1);
    });
  });
});
