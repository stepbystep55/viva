define(function(){
	'use strict';

	// trigonometric utilities
	/*
	 * p for method arguments must be an object having x, y.
	 */
	var trigonometry = {

		dist: function(p1, p2){
			return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		}

		// = get the angle in radians between point1 and point2
		, ang: function(p1, p2){
			var pMag = Math.sqrt(p1.x * p1.x + p1.y * p1.y); // magnitude of p
			var npx = p1.x / pMag; var npy = p1.y / pMag; // normalized
			pMag = Math.sqrt(p2.x * p2.x + p2.y * p2.y); // magnitude of p2
			var np2x = p2.x / pMag; var np2y = p2.y / pMag; // normalized
			return (Math.atan2(np2y, np2x) - Math.atan2(npy, npx));
		}
		, toDegree: function(angle){
			return angle * 180 / Math.PI;
		}

		, add: function(p1, p2, normalized){
			var x = p1.x + p2.x;
			var y = p1.y + p2.y;
			if(normalized){
				var mag = Math.sqrt(x * x + y * y);
				x = x / mag;
				y = y / mag;
			}
			return {x: x, y: y};
		}

		, sub: function(p1, p2, normalized){
			var x = p1.x - p2.x;
			var y = p1.y - p2.y;
			if(normalized){
				var mag = Math.sqrt(x * x + y * y);
				x = x / mag;
				y = y / mag;
			}
			return {x: x, y: y};
		}
		, mult: function(p, n){
			return {x: p.x * n, y: p.y * n};
		}
		, mag: function(p){
			return Math.sqrt(p.x * p.x + p.y * p.y);
		}

		// = get the point moved by specified angle
		, mv: function(p, ang){
			var pMag = Math.sqrt(p.x * p.x + p.y * p.y); // magnitude of p
			var oAng = Math.atan2(p.y, p.x); // original angle
			return {x: (pMag * Math.cos(oAng + ang)), y: (pMag * Math.sin(oAng + ang))};
		}

		// = get the mid point between two points.
		, mid: function(p1, p2){
			return {
				x: p1.x + (p2.x - p1.x) / 2
				, y: p1.y + (p2.y - p1.y) / 2
			};
		}

		// = get the projected point on the line
		, prj: function(end1, end2, p){
			var end1ToPoint = {x: p.x - end1.x, y: p.y - end1.y};
			var end1ToEnd2 = {x: end2.x - end1.x, y: end2.y - end1.y};
			var lengEnd1ToPoint = Math.sqrt(Math.pow(end1ToPoint.x, 2) + Math.pow(end1ToPoint.y, 2));
			var angleBetween = this.ang(end1ToPoint, end1ToEnd2);
			var lengEnd1ToProjected = lengEnd1ToPoint * Math.cos(angleBetween);
			var lengEnd1ToEnd2 = Math.sqrt(Math.pow(end1ToEnd2.x, 2) + Math.pow(end1ToEnd2.y, 2));
			var end1ToEnd2Normalized = {x: end1ToEnd2.x / lengEnd1ToEnd2, y: end1ToEnd2.y / lengEnd1ToEnd2};
			return {
				x: end1.x + end1ToEnd2Normalized.x * lengEnd1ToProjected
				, y: end1.y + end1ToEnd2Normalized.y * lengEnd1ToProjected
			};
		}

		// = return 1 if p in the 1st or 3rd quadrant, unless -1
		, poleQuad: function(orgn, p){
			if(p.x === orgn.x || p.y === orgn.y) return 0;
			var xpole = (p.x > orgn.x) ? 1 : -1;
			var ypole = (p.y > orgn.y) ? 1 : -1;
			return xpole * ypole;
		}
	};

	return {
		tri: trigonometry
	};
});
