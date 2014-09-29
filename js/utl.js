define(function(){
	'use strict';

	// trigonometric utilities
	/*
	 * p for method arguments must be an object having x, y.
	 */
	var trigonometry = {

		// = For the sake of setting only one object for x without y. a can be undefined
		to3args: function(x, y, a){
			if(typeof x === 'number' && typeof y === 'number'){
				return arguments;
			}else if(typeof x === 'object'){
				return [x.x, x.y, y];
			}
			throw 'Illegal arguments: ' + arguments;
		}
		, to5args: function(x1, y1, x2, y2, a){
			if((typeof x1 === 'number' && typeof y1 === 'number')
				&&(typeof x2 === 'number' && typeof y2 === 'number')){
				return arguments;
			}else if(typeof x1 === 'object' && typeof y1 === 'object'){
				return [x1.x, x1.y, y1.x, y1.y, x2];
			}
			throw 'Illegal arguments: ' + arguments;
		}

		, dist: function(x1, y1, x2, y2){
			// you can use this as dist(p1, p2)
			var [x1, y1, x2, y2] = this.to5args(x1, y1, x2, y2);

			return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
		}

		// = get the angle in radians between point1 and point2
		, ang: function(x1, y1, x2, y2){
			// you can use this as ang(p1, p2)
			var [x1, y1, x2, y2] = this.to5args(x1, y1, x2, y2);

			var pMag = Math.sqrt(x1 * x1 + y1 * y1); // magnitude of p
			var npx = x1 / pMag; var npy = y1 / pMag; // normalized
			pMag = Math.sqrt(x2 * x2 + y2 * y2); // magnitude of p2
			var np2x = x2 / pMag; var np2y = y2 / pMag; // normalized
			return (Math.atan2(np2y, np2x) - Math.atan2(npy, npx));
		}
		, toDegree: function(angle){
			return angle * 180 / Math.PI;
		}

		, add: function(x1, y1, x2, y2, normalized){
			// you can use this as add(p1, p2, n)
			var [x1, y1, x2, y2, normalized] = this.to5args(x1, y1, x2, y2, normalized);

			var x = x1 + x2;
			var y = y1 + y2;
			if(normalized){
				var mag = Math.sqrt(x * x + y * y);
				x = x / mag;
				y = y / mag;
			}
			return {x: x, y: y};
		}

		, sub: function(x1, y1, x2, y2, normalized){
			// you can use this as sub(p1, p2, n)
			var [x1, y1, x2, y2, normalized] = this.to5args(x1, y1, x2, y2, normalized);

			var x = x1 - x2;
			var y = y1 - y2;
			if(normalized){
				var mag = Math.sqrt(x * x + y * y);
				x = x / mag;
				y = y / mag;
			}
			return {x: x, y: y};
		}
		, mult: function(x, y, n){
			// you can use this as mult(p, n)
			var [x, y, n] = this.to3args(x, y, n);

			return {x: x * n, y: y * n};
		}
		, mag: function(x, y){
			// you can use this as mag(p)
			var [x, y] = this.to3args(x, y);

			return Math.sqrt(x * x + y * y);
		}

		// = get the point moved by specified angle
		, mv: function(x, y, ang){
			// you can use this as mv(p, ang)
			var [x, y, ang] = this.to3args(x, y, ang);

			var pMag = Math.sqrt(x * x + y * y); // magnitude of p
			var oAng = Math.atan2(y, x); // original angle
				return {x: (pMag * Math.cos(oAng + ang)), y: (pMag * Math.sin(oAng + ang))};
		}

		// = get the mid point between two points.
		, mid: function(x1, y1, x2, y2){
			// you can use this as mid(p1, p2)
			var [x1, y1, x2, y2] = this.to5args(x1, y1, x2, y2);

			return {
				x: x1 + (x2 - x1) / 2
				, y: y1 + (y2 - y1) / 2
			};
		}

		// = whether object1 & object2 are within a certain distance.
		, within: function(x1, y1, x2, y2, distance){
			// you can use this as within(p1, p2, d)
			var [x1, y1, x2, y2, distance] = this.to5args(x1, y1, x2, y2, distance);

			return (this.dist(x1, y1, x2, y2) < distance);
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

	var extention = {
		cutInArray: function(orgnArr, idx, arr){
			for(var i = 0; i < arr.length; i++) orgnArr.splice(idx + i, 0, arr[i]);
			return orgnArr;
		}
	};

	var renderer = {
		hex2rgb: function(hex){
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b){
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}
	};

	return {
		tri: trigonometry
		, ren: renderer
		, ex: extention
	};
});
