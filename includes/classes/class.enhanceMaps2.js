	
    "use strict"; // enable strict mode within this file
	
	var fs = require('fs'),
		log = require("./class.log"),
		quad = require("./class.quadtree"),
		realmConfig = require('../config.realm').config,
		BufferedWriter = require( realmConfig.libraries.bufferedWriter ),
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
	
	var enhance = function( args )
	{
		this._zonePoints = [];
		this._zoneVertices = [];
		this._zonePolys = [];
		this._zoneGrid = [];
		this._zoneWidth = [];
		this._zoneHeight = [];
		this._zoneGridByPolygon = [];
		
		this._gridCellWidth = 8;
		this._gridCellHeight = 8;
		
		var _data = require( args.sourceMapFileName ).zoneMeta;
		
		this._zonePoints[ args.sourceMapID ] = _data.points;
		this._zoneVertices[ args.sourceMapID ] = _data.vertices;
		this._zonePolys[ args.sourceMapID ] = _data.polys;
		
		log.addNotice( "Loaded raw map: " + args.sourceMapID );
		
		this.determineWidth( args.sourceMapID );
		
		log.addNotice( "Determined organically the map width and height: " + this._zoneWidth[ args.sourceMapID ] + "x" + this._zoneHeight[ args.sourceMapID ] );
		
		this.initGrid( args.sourceMapID );
		
		log.addNotice( "Initialized obstacle grid for map: " + args.sourceMapID );
		
		this.populateGrid( args.sourceMapID );
		
		log.addNotice( "Populated obstacle grid for map: " + args.sourceMapID );
		
		this.saveEnhancedMap( args.sourceMapID, args.targetMapDir, args.targetMapFileName );
	}
	
	enhance.prototype._determineRectangle = function( points, poly )
	{
		var minX = null, minY = null, maxX = null, maxY = null;
		
		for(var j=0;j<poly.coords.length;j++)
		{
			var currentPoint = points[ poly.coords[j] ];
			
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
		
		return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
	}
	
	enhance.prototype._pointInPolygon = function( x, y, poly, points )
	{
		var j = poly.coords.length - 1;
		var oddNodes = false;
		
		for(var i = 0;i < poly.coords.length; i++)
		{
			var pointI = poly.coords[i];
			var pointJ = poly.coords[j];
			
			var _pointIY = points[ pointI ][1];
			var _pointJY = points[ pointJ ][1];
			var _pointIX = points[ pointI ][0];
			var _pointJX = points[ pointJ ][0];
			
			if(
				_pointIX == x &&
				_pointIY == y
			)
			{
				return true;
			}
			
			if(
				( _pointIY < y && _pointJY >= y ) ||
				( _pointJY < y && _pointIY >= y )
			)
			{
				//alert( pointI + " " + pointJ + " --- " + _pointIX + " " + _pointIY + " " + _pointJX + " " + _pointJY + " || " + x + " " + y );
				//alert( ( _pointIX + ( y - _pointIY ) / ( ( _pointJY - _pointIY ) * ( _pointJX - _pointIX ) ) ) + " " + x );
				
				if(
					_pointIX + ( y - _pointIY ) / ( _pointJY - _pointIY ) * ( _pointJX - _pointIX ) < x
				)
				{
					oddNodes = !oddNodes;
				}
			}

			j = i;
		}

		return oddNodes;
	}
	
	enhance.prototype.determineWidth = function( zoneID )
	{
		var maxX = 0, maxY = 0;
		
		for(var i=0;i<this._zonePoints[ zoneID ].length;i++)
		{
			var _point = this._zonePoints[ zoneID ][ i ];
			
			if( _point[ 0 ] > maxX )
			{
				maxX = _point[ 0 ];
			}
			
			if( _point[ 1 ] > maxY )
			{
				maxY = _point[ 1 ];
			}
		}
		
		this._zoneWidth[ zoneID ] = maxX;
		this._zoneHeight[ zoneID ] = maxY;
	}
	
	enhance.prototype.initGrid = function( zoneID )
	{
		this._zoneGrid[ zoneID ] = [];
		
		for(var i = 0;i<Math.ceil( this._zoneWidth[ zoneID ] / this._gridCellWidth );i++)
		{
			this._zoneGrid[ zoneID ][ i ] = [];
			
			for(var j = 0;j<Math.ceil( this._zoneHeight[ zoneID ] / this._gridCellHeight );j++)
			{
				this._zoneGrid[ zoneID ][ i ][ j ] = 0;	// empty area
			}
		}
	}
	
	enhance.prototype.populateGrid = function( zoneID )
	{
		var self = this;
		
		self._zoneGridByPolygon[ zoneID ] = [];
		
		var _bruteForceProcess = function( rectangle, polyNumber, markAs )
		{
			self._zoneGridByPolygon[ zoneID ][ polyNumber ] = {
																		startX: Math.floor( rectangle.minX / self._gridCellWidth ),
																		startY: Math.floor( rectangle.minY / self._gridCellHeight ),
																		type: self._zonePolys[ zoneID ][ polyNumber ].pid,
																		map: []
																	};
			
			for(var x=rectangle.minX;x<=rectangle.maxX;x+=self._gridCellWidth / 2)
			{
				self._zoneGridByPolygon[ zoneID ][ polyNumber ].map[ Math.floor( ( x - rectangle.minX ) / self._gridCellWidth ) ] = [];
				
				for(var y=rectangle.minY;y<=rectangle.maxY;y+=self._gridCellHeight / 2)
				{
					if( !self._pointInPolygon( x, y, _poly, self._zonePoints[ zoneID ] ) )
					{
						self._zoneGridByPolygon[ zoneID ][ polyNumber ].map[ Math.floor( ( x - rectangle.minX ) / self._gridCellWidth ) ][ Math.floor( ( y - rectangle.minY ) / self._gridCellHeight ) ] = 0; // area not covered by the poly
						
						continue;
					}
					
					var _x = Math.floor( x / self._gridCellWidth ),
							_y = Math.floor( y / self._gridCellHeight );
					
					self._zoneGridByPolygon[ zoneID ][ polyNumber ].map[ Math.floor( ( x - rectangle.minX ) / self._gridCellWidth ) ][ Math.floor( ( y - rectangle.minY ) / self._gridCellHeight ) ] = 1;	// area covered by poly
					
					self._zoneGrid[ zoneID ][ _x ][ _y ] = markAs;
				}
			}
		}
		
		var _maxPolys = this._zonePolys[ zoneID ].length;
		for(var i=0;i<_maxPolys;i++)
		{
			var _poly = this._zonePolys[ zoneID ][ i ];
			
			log.add( "Processing poly " + ( i + 1 ) + "/" + _maxPolys + " ( " + _poly.coords.length + " points )" );
			
			var rectangle = this._determineRectangle( this._zonePoints[ zoneID ], _poly );
			
			log.add( "Determined the rectangle coords for this poly to be " + JSON.stringify( rectangle ) );
			
			self._zoneGridByPolygon[ zoneID ][ i ] = {};
			
			if( _poly.walkable == true )
			{
				_bruteForceProcess( rectangle, i, 0 );	// walkable area
				
				log.add( "Finished brute force processing the walkable coordinates for poly " + i );
				
				continue;
			}
			
			// a non walkable area
			
			_bruteForceProcess( rectangle, i, 1 );	// wall
			
			log.add( "Finished brute force processing the wall coordinates for poly " + i );
			
			/*
			for(var j=0;j<_poly.coords.length;j++)
			{
				var startPoint = this._zonePoints[ zoneID ][ _poly.coords[ j ] ];
				var endPoint = this._zonePoints[ zoneID ][ _poly.coords[ ( ( ( j + 1 ) == _poly.coords.length ) ? 0 : ( j + 1 ) ) ] ];	// next point or the first should we have reached the end
				
				_rayTrace(
						startPoint[ 0 ],
						startPoint[ 1 ],
						endPoint[ 0 ],
						endPoint[ 1 ],
						function( x, y )
						{
							var _x = Math.floor( x / self._gridCellWidth );
							var _y = Math.floor( y / self._gridCellHeight );
							
							self._zoneGrid[ zoneID ][ _x ][ _y ] = 1;	// wall
						}
					);
			}
			*/
		}
	}
	
	enhance.prototype.saveEnhancedMap = function( zoneID, fileDir, fileName )
	{
		var _grid = this._zoneGrid[ zoneID ], _savedGridString = "[";
		
		// save each poly independently
		for(var i=0;i<this._zoneGridByPolygon[ zoneID ].length;i++)
		{
			var _poly = this._zoneGridByPolygon[ zoneID ][ i ],
					_targetFile = fileDir + zoneID + "_" + _poly.type + ".js";
			
			new BufferedWriter( _targetFile, { encoding: "utf8" } )
					.on("error", function( error )
					{
						log.addError( error );
					})
					//.write( 'exports.polyMeta=' + JSON.stringify( _poly ) )
					.write( JSON.stringify( _poly ) )
					.close(function(err)
					{
						log.addNotice( "Saved Enhanced Poly " + i + " for zoneID " + zoneID + " @ " + _targetFile );
					});
		}
		
		// save uniform grid
		for(var i=0;i<_grid.length;i++)
		{
			_savedGridString += ( "\n" + JSON.stringify( _grid[ i ] ) );
			
			if( i < _grid.length - 1 )
			{
				_savedGridString += ",";
			}
		}
		
		_savedGridString += "]";
		
		fs.writeFile(
					fileName,
					'exports.zoneMeta={"grid":' + _savedGridString + "\n" +
							',"width":' + this._zoneWidth[ zoneID ] + "\n" +
							',"height":' + this._zoneHeight[ zoneID ] + "\n" +
							',"gridCellWidth":' + this._gridCellWidth + "\n" +
							',"gridCellHeight":' + this._gridCellHeight + "\n" +
							',"points":' + JSON.stringify( this._zonePoints[ zoneID ] ) + "\n" +
							',"vertices":' + JSON.stringify( this._zoneVertices[ zoneID ] ) + "\n" +
							',"polys":' + JSON.stringify( this._zonePolys[ zoneID ] ) +
							'}',
					function(err)
					{
						if( err )
						{
							throw err;
						}
						
						log.addNotice( "Saved Enhanced Map for zoneID " + zoneID + " @ " + fileName );
					}
				);
	}
	
	exports.enhance = enhance;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	