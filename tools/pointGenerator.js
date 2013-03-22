		
		"use strict";
		
		exports.generatePointsInPolygon = function( args )
		{
			this.allowedPointDistance = 60;
			this.triangles = [];
			this.triangles2 = [];
			this.totalArea = 0;
			this.attempt = 0;
			this.points = [];
			this.polygonPoints = [];
			this.pointsToGenerate = args.pointsNumber;
			this.pointsLengthArray = [];
			this.polygon = args.polygon;
			
			for( var i = 0; i < this.polygon.length; i++ )
			{
				var point = new this.addPoint(
					this.polygon[i].x,
					this.polygon[i].y
				);
				
				this.polygonPoints.push( point );
				this.pointsLengthArray.push( this.pointsLengthArray.length);
			}

			this.polygonTriangulation()
			this.formTriangles();
			this.generatePoints();

			args.onSuccess( { generatedCoordinates : this.points } );
		
			
			// Add point with x, y coordinates
			generatePointsInPolygon.prototype.addPoint = function point(x,y)
			{
				this.x=x;
				this.y=y;
				this.clone=function()
				{
					return new point(this.x,this.y);
				}
			}

			// Polygon Area Calculator
			generatePointsInPolygon.prototype.polygonArea = function( points )
			{
				var sum=0;
				
				for(var i=0,l=points.length;i<l;++i)
				{
					sum += points[i].x*points[(i+1)%l].y - points[(i+1)%l].x*points[i].y;
				}
				
				return sum/2;
			}

			// Form Triangles from 
			generatePointsInPolygon.prototype.formTriangles = function()
			{
				
				for(var i=0;i< this.pointsLengthArray.length;i+=3)
				{
					var coords = []
						coords.push(this.polygonPoints[ this.pointsLengthArray[i]])
						coords.push(this.polygonPoints[ this.pointsLengthArray[i+1]])
						coords.push(this.polygonPoints[ this.pointsLengthArray[i+2]])
					var triangle = {}
				
					triangle[ 'coords' ] = coords;
					triangle[ 'area' ] = -this.polygonArea( coords );
					this.totalArea += Math.floor( triangle.area )
					
					this.triangles.push( triangle );	
					
				}
				
				for(var i=0;i<this.triangles.length;i++)
				{
					this.triangles[ i ][ 'weight' ] = ( parseInt( this.triangles[ i ].area ) / parseInt( this.totalArea ) ).toFixed(2) * 100;

					if( this.triangles[ i ][ 'weight' ] < 0 )
					{
						this.triangles.splice( i, 1 );
					}
				}
			}

			// triangulate polygon
			generatePointsInPolygon.prototype.polygonTriangulation = function()
			{
				var ptsArea=[];
				
				if(  this.pointsLengthArray.length < 4)
				{
					this.formTriangles(  this.pointsLengthArray );
					return;
				}
				
				for(var i=0,l= this.pointsLengthArray.length;i<l;++i)
					ptsArea[i] = this.polygonPoints[ this.pointsLengthArray[i] ].clone();
				var pArea = polygonArea( ptsArea );
				
				var cr = [];
				var nr = [];
				var r1,r2,r3;
				var v0,v1,v2;
				
				for( var i = 0; i <  this.pointsLengthArray.length; i++)
				{
					cr[ i ] =  this.pointsLengthArray[ i ];
				}
				
				while(cr.length>3)
				{
					for(var i=0,l=cr.length;i<l;++i)
					{
						r1 = cr[i%l];
						r2 = cr[(i+1)%l];
						r3 = cr[(i+2)%l];
						v1 = this.polygonPoints[r1];
						v2 = this.polygonPoints[r2];
						var v3 = this.polygonPoints[r3];
						
						var ok=true;
						for(var j=(i+3)%l;j!=i;j=(j+1)%l)
						{
							var ptsArea=[v1,v2,v3];
							var tArea=polygonArea(ptsArea);
							if((pArea<0 && tArea>0) || (pArea>0 && tArea<0) || ptInTri(this.polygonPoints[cr[j]],v1,v2,v3))
							{
								ok=false;
								break;
							}
						}
						if(ok)
						{
							nr.push(r1);
							nr.push(r2);
							nr.push(r3);
							cr.splice((i+1)%l,1);
							break;
						}
					}
				}
				
				nr.push(cr[0]);
				nr.push(cr[1]);
				nr.push(cr[2]);
				
				this.pointsLengthArray = nr;
			}

			//Compute barycentric coordinates
			var ptInTri = function( pt,v1,v2,v3 )
			{
				//Compute barycentric coordinates
				var denom = (v1.y-v3.y)*(v2.x-v3.x) + (v2.y-v3.y)*(v3.x-v1.x);
				var b1 = ( (pt.y-v3.y)*(v2.x-v3.x) + (v2.y-v3.y)*(v3.x-pt.x) ) / denom;
				var b2 = ( (pt.y-v1.y)*(v3.x-v1.x) + (v3.y-v1.y)*(v1.x-pt.x) ) / denom;
				var b3 = ( (pt.y-v2.y)*(v1.x-v2.x) + (v1.y-v2.y)*(v2.x-pt.x) ) / denom;
				
				if(b1<0 || b2<0 || b3<0)
					return false;
				return true;
			}

			// Generates a random point in triangle
			var getRandomPointInTriangle = function( triangle )
			{

				//P = aA + bB + cC
				//@see http://www.cgafaq.info/wiki/Random_Point_In_trianglele

				var a = Math.random();
				var b = Math.random();

				if (a + b > 1) {
					a = 1-a;
					b = 1-b;
				}

				var c = 1-a-b;

				var rndX = (a*triangle[0].x)+(b*triangle[1].x)+(c*triangle[2].x);
				var rndY = (a*triangle[0].y)+(b*triangle[1].y)+(c*triangle[2].y);

				return { x: rndX, y: rndY};
			}

			var dotLineLength = function(x, y, x0, y0, x1, y1, o)
			{
				function lineLength(x, y, x0, y0)
				{
					return Math.sqrt((x -= x0) * x + (y -= y0) * y);
				}
				
				
				if(o && !(o = function(x, y, x0, y0, x1, y1){
					if(!(x1 - x0)) return {x: x0, y: y};
					else if(!(y1 - y0)) return {x: x, y: y0};
					var left, tg = -1 / ((y1 - y0) / (x1 - x0));
					return {x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
				}(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))){
					var l1 = lineLength(x, y, x0, y0), l2 = lineLength(x, y, x1, y1);
					return l1 > l2 ? l2 : l1;
				}
				else {
					var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
					return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
				}
			}
			
			// Generate a point in a triangle
			generatePointsInPolygon.prototype.generatePoints = function() 
			{
				this.attempt++
				
				if( this.attempt > 2000 )
				{
					return;
				}

				var n = Math.floor(Math.random()*101);
				var m = Math.floor(Math.random()*(this.triangles.length));
				
				if( this.triangles[ m ].weight > n )
				{
					this.generatePoints();
					return;
				}
				
			//	this.triangles[ m ].weight -= 5;
				
			//	console.log( this.triangles[ j ].weight, n );
				var newPoint = getRandomPointInTriangle( this.triangles[ m ].coords );
				
				for( var i = 0; i < this.points.length; i ++ )
				{
					if( Math.round(
								Math.sqrt(
										Math.pow( this.points[ i ].x - newPoint.x, 2 ) + Math.pow( this.points[ i ].y - newPoint.y, 2 )
									)
							) > this.allowedPointDistance )
					{
						continue;
					}
					this.generatePoints();
					return;
				}
				
				for( var k = 0; k < this.polygon.length; k++ )
				{
					if( Math.round(
								Math.sqrt(
										Math.pow( this.polygon[ k ].x - newPoint.x, 2 ) + Math.pow( this.polygon[ k ].y - newPoint.y, 2 )
									)
							) > this.allowedPointDistance/2 )
					{
						continue;
					}
					this.generatePoints();
					return;
				}
				
				for( var k = 0; k < this.polygon.length; k++ )
				{
					//console.log( k, this.polygon.length )
					if( dotLineLength( newPoint.x, newPoint.y, this.polygon[ k ].x, this.polygon[ k ].y, this.polygon[ ( ( this.polygon.length - 1 == k ) ? 0 : k + 1 ) ].x, this.polygon[ ( ( this.polygon.length - 1 == k ) ? 0 : k + 1 ) ].y  )
							> this.allowedPointDistance/3 )
					{
						continue;
					}
					this.generatePoints();
					return;
				}

				this.points.push( { x: Math.floor( newPoint.x ), y: Math.floor( newPoint.y ) } );
				
				if( this.points.length < this.pointsToGenerate )
				{
					this.generatePoints();
				}
			}
		}