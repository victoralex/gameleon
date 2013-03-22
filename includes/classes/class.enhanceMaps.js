
    "use strict"; // enable strict mode within this file
		
	var sys = require("sys"), fs = require('fs'),
		log = require("./class.log"),
		quad = require("./class.quadtree"),
		realmConfig = require('../config.realm').config,
		libxmljs = require( realmConfig.libraries.libXMLJSPath );
	
	var _rayTrace = function( x0, y0, x1, y1, onRayTrace )
	{
		var dx = Math.abs(x1 - x0);
		var dy = Math.abs(y1 - y0);

		var x = parseInt(Math.floor(x0));
		var y = parseInt(Math.floor(y0));

		var n = 1;
		var x_inc, y_inc;
		var error;

		if (dx == 0)
		{
			x_inc = 0;
			error = 9999999999; // infinity
		}
		else if (x1 > x0)
		{
			x_inc = 1;
			n += parseInt(Math.floor(x1)) - x;
			error = (Math.floor(x0) + 1 - x0) * dy;
		}
		else
		{
			x_inc = -1;
			n += x - parseInt(Math.floor(x1));
			error = (x0 - Math.floor(x0)) * dy;
		}

		if (dy == 0)
		{
			y_inc = 0;
			error -= 9999999999; // infinity
		}
		else if (y1 > y0)
		{
			y_inc = 1;
			n += parseInt(Math.floor(y1)) - y;
			error -= (Math.floor(y0) + 1 - y0) * dx;
		}
		else
		{
			y_inc = -1;
			n += y - parseInt(Math.floor(y1));
			error -= (y0 - Math.floor(y0)) * dx;
		}

		for (; n > 0; --n)
		{
			if( onRayTrace( x, y ) == true )
			{
				// function ended the raytrace process. continuing is not required
				
				return;
			}
			
			if (error > 0)
			{
				y += y_inc;
				error -= dx;
			}
			else
			{
				x += x_inc;
				error += dy;
			}
		}
	};
	
	var enhance = function( sourceMapFileName, sourceMapID, targetMapFileName )
	{
		this._zonePoints = [];
		this._zoneVertices = [];
		this._zonePolys = [];
		this._zoneRectanglesSortedByX = [];
		this._zoneRectanglesSortedByY = [];
		this._zoneQuadTree = [];
		
		var _data = require( sourceMapFileName ).zoneMeta;
		
		this._zonePoints[ sourceMapID ] = _data.points;
		this._zoneVertices[ sourceMapID ] = _data.vertices;
		this._zonePolys[ sourceMapID ] = _data.polys;
		
		log.add( "Loaded raw map: " + sourceMapID );
		
		this.createRectangles( sourceMapID );
		
		log.add( "Created Rectangles for: " + sourceMapID );
		
		this.createQuad( sourceMapID );
		
		log.add( "Created QuadTree for: " + sourceMapID );
		
		this.saveEnhancedMap( sourceMapID, targetMapFileName );
	}
	
	enhance.prototype.createRectangles = function( zoneID )
	{
		var _zoneRectangles = [];
		
		for(var i=0;i<this._zonePolys[ zoneID ].length;i++)
		{
			// get the points for each poly
			
			var minX = null, minY = null, maxX = null, maxY = null;
			
			for( var j=0;j<this._zonePolys[ zoneID ][i].coords.length;j++)
			{
				var currentPoint = this._zonePoints[ zoneID ][ this._zonePolys[ zoneID ][i].coords[j] ];
				
				if( minX == null || currentPoint[ 0 ] < minX )
				{
					minX = currentPoint[0];
				}
				
				if( maxX == null || currentPoint[ 0 ] > maxX )
				{
					maxX = currentPoint[0];
				}
				
				if( minY == null || currentPoint[ 1 ] < minY )
				{
					minY = currentPoint[1];
				}
				
				if( maxY == null || currentPoint[ 1 ] > maxY )
				{
					maxY = currentPoint[1];
				}
			}
			
			_zoneRectangles.push( [ i, minX, minY, maxX, maxY ] );
		}
		
		this._zoneRectanglesSortedByX[ zoneID ] = JSON.parse(JSON.stringify(_zoneRectangles));
		this._zoneRectanglesSortedByX[ zoneID ].sort(	function( a, b )
																					{
																						return a[1] - b[1];
																					});
		
		this._zoneRectanglesSortedByY[ zoneID ] = JSON.parse(JSON.stringify(_zoneRectangles));
		this._zoneRectanglesSortedByY[ zoneID ].sort(	function( a, b )
																					{
																						return a[2] - b[2];
																					});
		
		return true;
	}
	
	enhance.prototype.createQuad = function( zoneID )
	{
		var self = this;
		
		/*
		this._zoneQuadTree[ zoneID ] = new quad.QuadTree( {
																					x:0,
																					y:0,
																					width: 1000,
																					height: 1000
																				}, true, 8, 1);
		*/
		
		self._zoneQuadTree[ zoneID ] = [{
														x:0,
														y:0,
														width: 4000,
														height: 4000
													}];
		
		for( var i=0;i<this._zonePolys[ zoneID ].length;i++ )
		{
			var coords = this._zonePolys[ zoneID ][i].coords;
			
			if( coords.length <= 1 || this._zonePolys[ zoneID ][i].walkable == true )
			{
				// at least 2 points need to be in a poly and that poly must be an obstacle
				
				continue;
			}
			
			log.addNotice( "Polygon " + this._zonePolys[ zoneID ][ i ].pid + " is an obstacle" );
			
			for( var j=0;j<coords.length;j++ )
			{
				var x0 = this._zonePoints[ zoneID ][ coords[j] ][ 0 ];
				var y0 = this._zonePoints[ zoneID ][ coords[j] ][ 1 ];
				
				if( j == coords.length - 1 )
				{
					var x1 = this._zonePoints[ zoneID ][ coords[0] ][ 0 ];
					var y1 = this._zonePoints[ zoneID ][ coords[0] ][ 1 ];
				}
				else
				{
					var x1 = this._zonePoints[ zoneID ][ coords[ j + 1 ] ][ 0 ];
					var y1 = this._zonePoints[ zoneID ][ coords[ j + 1 ] ][ 1 ];
				}
				
				_rayTrace( x0, y0, x1, y1, function( x, y )
														{
															self._zoneQuadTree[ zoneID ].push( {
																												x:x,
																												y:y,
																												startVertice: coords[j],
																												endVertice: coords[ ( j == coords.length - 1 ) ? 0 : ( j +1 ) ]
																											} );
														});
			}
		}
	}
	
	enhance.prototype.saveEnhancedMap = function( zoneID, fileName )
	{
		fs.writeFile(
				fileName,
				'exports.zoneMeta={"points":' + JSON.stringify( this._zonePoints[ zoneID ] ) + 
												"\n" + ',"vertices":' + JSON.stringify( this._zoneVertices[ zoneID ] ) +
												"\n" + ',"polys":' + JSON.stringify( this._zonePolys[ zoneID ] ) +
												"\n" + ',"rectanglesByX":' + JSON.stringify( this._zoneRectanglesSortedByX[ zoneID ] ) + 
												"\n" + ',"rectanglesByY":' + JSON.stringify( this._zoneRectanglesSortedByY[ zoneID ] ) + 
												"\n" + ',"quadTree":' + JSON.stringify( this._zoneQuadTree[ zoneID ] ) + 
											'}',
				function(err)
				{
					if(err)
					{
						throw err;
					}
					
					log.add( "Saved Enhanced Map for: " + zoneID );
				});
	}
	
	exports.enhance = enhance;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	