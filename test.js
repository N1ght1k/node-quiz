var x = 8;
var y = 1; 
var xp = new Array(1,1,3,3,7,7); // Массив X-координат полигона
var yp = new Array(1,6,6,3,3,1); // Массив Y-координат полигона
function inPoly(x,y){
	npol = xp.length;
	j = npol - 1;
	var c = 0;
	for (var i = 0; i < npol;i++){
			if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
			(x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
			 c = !c
			 }
			 j = i;
	}
return c;
}
inPoly(x,y);
console.log(inPoly(x,y))